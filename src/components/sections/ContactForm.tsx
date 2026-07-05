"use client";

import { useRef, useState, type FormEvent } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import type { ContactFormContent } from "@/types";

interface ContactFormProps {
  content: ContactFormContent;
}

type Status = "idle" | "sending" | "success" | "error";

const inputClasses =
  "w-full px-4 py-3 bg-surface border border-border rounded-lg text-text-main text-sm placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors duration-200";

export default function ContactForm({ content }: ContactFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useGSAP(
    () => {
      gsap.from(formRef.current!.children, {
        y: 30,
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: formRef.current,
          start: "top 85%",
        },
      });
    },
    { scope: formRef }
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    setStatus("sending");
    setErrorMessage(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          message: formData.get("message"),
          company: formData.get("company"),
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setErrorMessage(data?.error ?? content.error);
        setStatus("error");
        return;
      }

      form.reset();
      setStatus("success");
    } catch {
      setErrorMessage(content.error);
      setStatus("error");
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate={false} className="space-y-5">
      <h3 className="text-2xl font-bold text-text-main">{content.title}</h3>

      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="contact-name" className="block font-mono text-xs text-text-muted tracking-widest uppercase mb-2">
            {content.fields.name.label}
          </label>
          <input
            id="contact-name"
            type="text"
            name="name"
            required
            maxLength={100}
            placeholder={content.fields.name.placeholder}
            className={inputClasses}
          />
        </div>
        <div>
          <label htmlFor="contact-email" className="block font-mono text-xs text-text-muted tracking-widest uppercase mb-2">
            {content.fields.email.label}
          </label>
          <input
            id="contact-email"
            type="email"
            name="email"
            required
            maxLength={200}
            placeholder={content.fields.email.placeholder}
            className={inputClasses}
          />
        </div>
      </div>

      <div>
        <label htmlFor="contact-message" className="block font-mono text-xs text-text-muted tracking-widest uppercase mb-2">
          {content.fields.message.label}
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          maxLength={5000}
          rows={5}
          placeholder={content.fields.message.placeholder}
          className={`${inputClasses} resize-y min-h-[120px]`}
        />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={status === "sending"}
          className="px-6 py-3 bg-accent text-background font-medium text-sm rounded-lg hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition-opacity duration-200"
        >
          {status === "sending" ? content.sending : content.submit}
        </button>

        {status === "success" && (
          <p role="status" className="text-sm text-accent font-medium">
            {content.success}
          </p>
        )}
        {status === "error" && (
          <p role="alert" className="text-sm text-text-muted">
            {errorMessage ?? content.error}
          </p>
        )}
      </div>
    </form>
  );
}
