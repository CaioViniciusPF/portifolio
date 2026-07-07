"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { gsap, useGSAP, SplitText, MOTION_OK, REDUCED } from "@/lib/gsap";
import type { ContactData } from "@/types";
import ContactForm from "./ContactForm";

const MorphShape = dynamic(() => import("@/components/three/MorphShape"), {
  ssr: false,
});

interface ContactProps {
  data: ContactData;
}

const links = (data: ContactData) => [
  {
    label: data.emailLabel,
    value: data.email,
    href: `mailto:${data.email}`,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    label: "GitHub",
    value: data.github,
    href: `https://${data.github}`,
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    value: data.linkedin,
    href: `https://${data.linkedin}`,
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: data.locationLabel,
    value: data.location,
    href: null,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

export default function Contact({ data }: ContactProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(REDUCED, () => {
        gsap.set(cardsRef.current!.children, { opacity: 1, y: 0 });
      });

      mm.add(MOTION_OK, () => {
        const split = SplitText.create(headingRef.current, {
          type: "chars, words",
          mask: "chars",
        });
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            once: true,
          },
        });

        tl.from(split.chars, {
          yPercent: 110,
          duration: 0.9,
          ease: "power4.out",
          stagger: 0.02,
        });
        tl.from(
          descRef.current,
          { y: 20, opacity: 0, duration: 0.6 },
          "-=0.4"
        );

        gsap.from(cardsRef.current!.children, {
          y: 30,
          opacity: 0,
          duration: 0.5,
          stagger: 0.1,
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 85%",
            once: true,
          },
        });
      });
    },
    { scope: sectionRef }
  );

  const contactLinks = links(data);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative isolate overflow-x-clip py-24 md:py-32 px-6"
    >
      <div
        aria-hidden
        className="absolute -z-10 pointer-events-none bottom-0 -left-40 w-[36rem] h-[36rem] opacity-10 bg-[radial-gradient(closest-side,var(--color-accent),transparent_72%)]"
      />
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 md:mb-16 max-w-3xl">
          <h2
            ref={headingRef}
            className="font-display font-bold text-text-main text-5xl md:text-7xl tracking-[-0.02em] mb-5"
          >
            {data.ctaHeadline}
          </h2>
          <p ref={descRef} className="text-text-muted text-lg md:text-xl">
            {data.description}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <ContactForm content={data.form} />

          <div aria-hidden className="hidden lg:block relative">
            <MorphShape />
          </div>
        </div>

        <div
          ref={cardsRef}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12"
        >
          {contactLinks.map((link) =>
            link.href ? (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="relative flex flex-col gap-3 p-5 bg-surface border border-border rounded-lg hover:border-accent hover:text-accent transition-colors duration-200 group"
              >
                {link.href.startsWith("http") && (
                  <svg
                    className="absolute top-4 right-4 w-3.5 h-3.5 text-text-muted group-hover:text-accent transition-colors duration-200"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                )}
                <span className="text-text-muted group-hover:text-accent transition-colors duration-200">
                  {link.icon}
                </span>
                <div>
                  <p className="font-mono text-xs text-text-muted tracking-widest uppercase mb-0.5">
                    {link.label}
                  </p>
                  <p className="text-text-main text-sm font-medium break-all">{link.value}</p>
                </div>
              </a>
            ) : (
              <div
                key={link.label}
                className="flex flex-col gap-3 p-5 bg-surface border border-border rounded-lg"
              >
                <span className="text-text-muted">{link.icon}</span>
                <div>
                  <p className="font-mono text-xs text-text-muted tracking-widest uppercase mb-0.5">
                    {link.label}
                  </p>
                  <p className="text-text-main text-sm font-medium">{link.value}</p>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
