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

export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const confirmationRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [fileNames, setFileNames] = useState<string[]>([]);

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
      const response = await fetch("/api/contact", {
        method: "POST",
        body: new FormData(event.currentTarget),
      });
      const data = await response.json();

      if (response.ok && data.ok) {
        setStatus("sent");
        formRef.current?.reset();
        setFileNames([]);
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
          id="attachments"
          name="attachments"
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.png,.jpg,.jpeg,.webp,.heic,.dwg,.dxf,.rvt,.zip"
          onChange={(e) =>
            setFileNames(Array.from(e.target.files ?? []).map((f) => f.name))
          }
          className="w-full cursor-pointer rounded-md border border-rule bg-charcoal px-4 py-3.5 text-sm text-bone-dim transition-colors file:mr-4 file:cursor-pointer file:rounded-full file:border-0 file:bg-amber file:px-5 file:py-2 file:text-xs file:font-medium file:uppercase file:tracking-widest file:text-charcoal hover:border-amber/50"
        />
        {fileNames.length > 0 && (
          <ul className="mt-3 space-y-1">
            {fileNames.map((fileName) => (
              <li key={fileName} className="text-sm text-bone-dim">
                {fileName}
              </li>
            ))}
          </ul>
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
