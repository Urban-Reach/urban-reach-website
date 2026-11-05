"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/data/site";

const PROJECT_TYPES = [
  "Multifamily development",
  "Office buildout",
  "Tenant improvement",
  "Interior finish work",
  "Something else",
];

const inputClass =
  "w-full rounded-md border border-rule bg-charcoal px-4 py-3.5 text-bone " +
  "placeholder:text-bone-dim/60 transition-colors duration-300 " +
  "focus:border-amber focus:outline-none focus-visible:outline-none";

type Status = "idle" | "sending" | "sent" | "error";

const MAX_FILES = 5;
const MAX_TOTAL_BYTES = 10 * 1024 * 1024;
const ACCEPT =
  ".pdf,.doc,.docx,.xls,.xlsx,.csv,.png,.jpg,.jpeg,.webp,.heic,.dwg,.dxf,.rvt,.zip";

const fileKey = (f: File) => `${f.name}:${f.size}:${f.lastModified}`;

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const confirmationRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const totalBytes = files.reduce((sum, f) => sum + f.size, 0);

  function addFiles(picked: FileList | null) {
    if (!picked?.length) return;
    const seen = new Set(files.map(fileKey));
    const next = [...files];
    let skipped = "";
    for (const file of Array.from(picked)) {
      if (seen.has(fileKey(file))) continue;
      if (next.length >= MAX_FILES) {
        skipped = `You can attach up to ${MAX_FILES} files.`;
        break;
      }
      if (next.reduce((sum, f) => sum + f.size, 0) + file.size > MAX_TOTAL_BYTES) {
        skipped = `"${file.name}" would take attachments over 10 MB. Please send larger files by email.`;
        continue;
      }
      seen.add(fileKey(file));
      next.push(file);
    }
    setFiles(next);
    setErrors((current) => {
      const rest = { ...current };
      delete rest.attachments;
      return skipped ? { ...rest, attachments: skipped } : rest;
    });
  }

  function removeFile(key: string) {
    setFiles((current) => current.filter((f) => fileKey(f) !== key));
    setErrors((current) => {
      const rest = { ...current };
      delete rest.attachments;
      return rest;
    });
  }

  useEffect(() => {
    if (status === "sent") {
      confirmationRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      confirmationRef.current?.focus({ preventScroll: true });
    }
  }, [status]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setErrors({});
    setMessage("");

    try {
      const body = new FormData(event.currentTarget);
      for (const file of files) body.append("attachments", file);
      const response = await fetch("/api/contact", { method: "POST", body });
      const data = await response.json();

      if (response.ok && data.ok) {
        setStatus("sent");
        formRef.current?.reset();
        setFiles([]);
        return;
      }

      setStatus("error");
      setErrors(data.errors ?? {});
      setMessage(
        data.message ??
          (data.errors
            ? "Please check the highlighted fields."
            : `Something went wrong. Please email ${site.email} directly.`),
      );
    } catch {
      setStatus("error");
      setMessage(
        `Something went wrong sending your message. Please email ${site.email} directly.`,
      );
    }
  }

  if (status === "sent") {
    return (
      <div
        ref={confirmationRef}
        role="status"
        tabIndex={-1}
        className="rounded-lg border border-amber/40 bg-charcoal p-10 text-center focus:outline-none"
      >
        <h3 className="font-display text-2xl">Thank you. Your message is in.</h3>
        <p className="mt-4 leading-relaxed text-bone-dim">
          We have received your inquiry and will follow up at the email address
          you provided. If it is time-sensitive, call{" "}
          <a href={site.phoneHref} className="link-underline text-amber">
            {site.phone}
          </a>
          .
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="label-caps-lg mt-8 text-amber underline underline-offset-4"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="space-y-6">
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Website (leave this field empty)</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Name" name="name" required error={errors.name}>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={inputClass}
          />
        </Field>

        <Field label="Email" name="email" required error={errors.email}>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={inputClass}
          />
        </Field>

        <Field label="Company" name="company" error={errors.company}>
          <input
            id="company"
            name="company"
            type="text"
            autoComplete="organization"
            className={inputClass}
          />
        </Field>

        <Field label="Phone" name="phone" error={errors.phone}>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Project type" name="projectType" error={errors.projectType}>
        <select id="projectType" name="projectType" defaultValue="" className={inputClass}>
          <option value="">Select one (optional)</option>
          {PROJECT_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </Field>

      <Field label="About the project" name="message" required error={errors.message}>
        <textarea
          id="message"
          name="message"
          rows={6}
          required
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
          placeholder="Scope, location, timeline, and anything you already know about the appliance package."
          className={`${inputClass} resize-y`}
        />
      </Field>

      <Field
        label="Attachments"
        name="attachments"
        error={errors.attachments}
        hint="Appliance schedules, spec sections, or plan sheets. Up to 5 files, 10 MB total."
      >
        <input
          ref={fileInputRef}
          id="attachments-picker"
          type="file"
          multiple
          accept={ACCEPT}
          tabIndex={-1}
          aria-hidden="true"
          className="sr-only"
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = "";
          }}
        />

        {files.length > 0 && (
          <ul className="mb-3 divide-y divide-rule rounded-md border border-rule bg-charcoal">
            {files.map((file) => (
              <li
                key={fileKey(file)}
                className="flex items-center gap-3 py-2.5 pl-4 pr-1.5 text-sm"
              >
                <span className="min-w-0 flex-1 truncate text-bone" title={file.name}>
                  {file.name}
                </span>
                <span className="shrink-0 text-xs text-bone-dim">
                  {formatSize(file.size)}
                </span>
                <button
                  type="button"
                  onClick={() => removeFile(fileKey(file))}
                  aria-label={`Remove ${file.name}`}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-bone-dim transition-colors hover:bg-walnut hover:text-amber focus-visible:text-amber"
                >
                  <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round">
                    <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}

        {files.length < MAX_FILES ? (
          <button
            id="attachments"
            type="button"
            onClick={() => fileInputRef.current?.click()}
            aria-describedby={errors.attachments ? "attachments-error" : undefined}
            className="flex w-full items-center justify-center gap-2.5 rounded-md border border-dashed border-rule bg-charcoal px-4 py-3.5 text-sm text-bone transition-colors hover:border-amber/60 hover:text-amber focus-visible:border-amber focus-visible:outline-none"
          >
            <span aria-hidden="true" className="text-lg leading-none text-amber">+</span>
            {files.length === 0 ? "Add files" : "Add another file"}
          </button>
        ) : (
          <p id="attachments" className="text-xs text-bone-dim">
            That&apos;s the limit of {MAX_FILES} files. Remove one to add a different file.
          </p>
        )}

        {files.length > 0 && (
          <p className="mt-2 text-xs text-bone-dim">
            {files.length} of {MAX_FILES} files, {formatSize(totalBytes)} of 10 MB
          </p>
        )}
      </Field>

      {status === "error" && message && (
        <p role="alert" className="rounded-md border border-amber/50 bg-walnut px-4 py-3 text-sm text-bone">
          {message}
        </p>
      )}

      <div className="flex flex-col gap-5 pt-2 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={status === "sending"}
          className="label-caps-lg inline-flex items-center justify-center gap-3 rounded-full bg-amber px-8 py-4 text-charcoal transition-all duration-300 hover:bg-bone disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "sending" ? "Sending…" : "Send message"}
          {status !== "sending" && (
            <span aria-hidden="true" className="text-base leading-none">
              →
            </span>
          )}
        </button>

        <p className="text-xs leading-relaxed text-bone-dim">
          We use what you send here only to respond to your inquiry. See our{" "}
          <a href="/privacy-policy" className="link-underline text-amber">
            privacy policy
          </a>
          .
        </p>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  required,
  error,
  hint,
  children,
}: {
  label: string;
  name: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={name} className="label-caps mb-3 block text-bone">
        {label}
        {required && (
          <span className="ml-1 text-amber" aria-hidden="true">
            *
          </span>
        )}
        {required && <span className="sr-only"> (required)</span>}
      </label>
      {children}
      {hint && <p className="mt-2 text-xs text-bone-dim">{hint}</p>}
      {error && (
        <p id={`${name}-error`} role="alert" className="mt-2 text-sm text-amber">
          {error}
        </p>
      )}
    </div>
  );
}
