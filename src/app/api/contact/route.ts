import { NextResponse } from "next/server";
import { Resend } from "resend";
import { site } from "@/data/site";

/**
 * Contact form endpoint.
 *
 * Forwards submissions to info@urbanreachtx.com via Resend (build prompt §8,
 * §11 — this must not ship as a non-functional UI stub).
 *
 * Why a server route rather than a client-side third-party endpoint:
 *  - the API key never reaches the browser bundle
 *  - the honeypot is validated server-side, where a bot cannot skip it
 *  - file attachments are supported, so a GC can send an appliance schedule
 *  - mail arrives from Urban Reach's own domain with no third-party branding
 *
 * REQUIRED ENVIRONMENT VARIABLES
 *   RESEND_API_KEY   API key from https://resend.com/api-keys
 *   CONTACT_FROM     Verified sender, e.g. "Urban Reach <website@urbanreachtx.com>"
 *                    The domain must be verified in Resend before this works.
 *   CONTACT_TO       Optional. Defaults to info@urbanreachtx.com.
 */

export const runtime = "nodejs";

const MAX_TOTAL_ATTACHMENT_BYTES = 10 * 1024 * 1024; // 10 MB
const MAX_FILES = 5;

/** Document types a contractor would realistically attach to an inquiry. */
const ALLOWED_EXTENSIONS = [
  "pdf", "doc", "docx", "xls", "xlsx", "csv",
  "png", "jpg", "jpeg", "webp", "heic",
  "dwg", "dxf", "rvt", "zip",
];

type FieldErrors = Record<string, string>;

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Could not read the submission." },
      { status: 400 },
    );
  }

  const value = (key: string) => (form.get(key) ?? "").toString().trim();

  const name = value("name");
  const email = value("email");
  const company = value("company");
  const phone = value("phone");
  const projectType = value("projectType");
  const message = value("message");

  // Honeypot (§10). Hidden from real users; bots fill it in. Respond with a
  // normal-looking success so the bot gets no signal that it was caught.
  if (value("website")) {
    return NextResponse.json({ ok: true });
  }

  const errors: FieldErrors = {};
  if (!name) errors.name = "Please enter your name.";
  if (!email) {
    errors.email = "Please enter your email address.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    errors.email = "Please enter a valid email address.";
  }
  if (!message) {
    errors.message = "Please tell us about the project.";
  } else if (message.length > 5000) {
    errors.message = "Please keep the message under 5,000 characters.";
  }

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  // ---- Attachments --------------------------------------------------------
  const files = form
    .getAll("attachments")
    .filter((f): f is File => f instanceof File && f.size > 0);

  if (files.length > MAX_FILES) {
    return NextResponse.json(
      { ok: false, errors: { attachments: `Please attach no more than ${MAX_FILES} files.` } },
      { status: 422 },
    );
  }

  const totalBytes = files.reduce((sum, f) => sum + f.size, 0);
  if (totalBytes > MAX_TOTAL_ATTACHMENT_BYTES) {
    return NextResponse.json(
      {
        ok: false,
        errors: {
          attachments:
            "Attachments total more than 10 MB. Please send larger files by email instead.",
        },
      },
      { status: 422 },
    );
  }

  for (const file of files) {
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return NextResponse.json(
        {
          ok: false,
          errors: { attachments: `“${file.name}” is not an accepted file type.` },
        },
        { status: 422 },
      );
    }
  }

  const attachments = await Promise.all(
    files.map(async (file) => ({
      filename: file.name,
      content: Buffer.from(await file.arrayBuffer()),
    })),
  );

  // ---- Send ---------------------------------------------------------------
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM;
  const to = process.env.CONTACT_TO ?? site.email;

  if (!apiKey || !from) {
    // Fail loudly in the server log, but do not tell the visitor that the site
    // is misconfigured — give them the direct email address instead.
    console.error(
      "[contact] Missing RESEND_API_KEY and/or CONTACT_FROM. " +
        "Set both in the environment before going live; see README.",
    );
    return NextResponse.json(
      {
        ok: false,
        message: `Something went wrong sending your message. Please email ${site.email} directly.`,
      },
      { status: 500 },
    );
  }

  const rows: [string, string][] = [
    ["Name", name],
    ["Email", email],
    ["Company", company || "—"],
    ["Phone", phone || "—"],
    ["Project type", projectType || "—"],
  ];

  const html = `
    <div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;line-height:1.6;color:#111">
      <h2 style="margin:0 0 16px">New website inquiry</h2>
      <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:20px">
        ${rows
          .map(
            ([label, val]) =>
              `<tr>
                 <td style="padding:4px 16px 4px 0;color:#666;vertical-align:top">${label}</td>
                 <td style="padding:4px 0"><strong>${escapeHtml(val)}</strong></td>
               </tr>`,
          )
          .join("")}
      </table>
      <div style="padding:16px;background:#f6f5f3;border-radius:6px">
        <div style="color:#666;margin-bottom:8px">Message</div>
        <div style="white-space:pre-wrap">${escapeHtml(message)}</div>
      </div>
      ${
        attachments.length
          ? `<p style="margin-top:20px;color:#666">${attachments.length} attachment${
              attachments.length === 1 ? "" : "s"
            }: ${attachments.map((a) => escapeHtml(a.filename)).join(", ")}</p>`
          : ""
      }
      <p style="margin-top:24px;color:#999;font-size:12px">
        Sent from the contact form at ${site.url}
      </p>
    </div>
  `;

  const text = [
    "New website inquiry",
    "",
    ...rows.map(([label, val]) => `${label}: ${val}`),
    "",
    "Message:",
    message,
  ].join("\n");

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: [to],
      replyTo: email,
      subject: `Website inquiry — ${name}${company ? ` (${company})` : ""}`,
      html,
      text,
      attachments: attachments.length ? attachments : undefined,
    });

    if (error) {
      console.error("[contact] Resend error:", error);
      return NextResponse.json(
        {
          ok: false,
          message: `Something went wrong sending your message. Please email ${site.email} directly.`,
        },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] Unexpected error:", err);
    return NextResponse.json(
      {
        ok: false,
        message: `Something went wrong sending your message. Please email ${site.email} directly.`,
      },
      { status: 500 },
    );
  }
}
