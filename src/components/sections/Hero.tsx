"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
import type { HeroData } from "@/types";

gsap.registerPlugin(TextPlugin);

interface HeroProps {
  data: HeroData;
}

export default function Hero({ data }: HeroProps) {
  const containerRef = useRef<HTMLElement>(null);
  const roleRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const cursorRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const greetingRef = useRef<HTMLParagraphElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const bioRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      gsap.set(cursorRefs.current.filter(Boolean), { visibility: "hidden" });

      tl.from(greetingRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.45,
      });

      tl.from(
        nameRef.current,
        {
          y: 30,
          opacity: 0,
          duration: 0.5,
        },
        "-=0.25"
      );

      data.roles.forEach((role, i) => {
        const position = i === 0 ? "-=0.5" : "+=0.25";

        tl.addLabel(`typing-${i}`, position);

        if (i > 0) {
          tl.set(cursorRefs.current[i - 1], { visibility: "hidden" }, `typing-${i}`);
        }
        tl.set(cursorRefs.current[i], { visibility: "visible" }, `typing-${i}`);

        tl.to(
          roleRefs.current[i],
          {
            duration: role.length * 0.09,
            text: { value: role, delimiter: "" },
            ease: "none",
          },
          `typing-${i}`
        );
      });

      tl.from(
        bioRef.current,
        {
          y: 20,
          opacity: 0,
          duration: 0.45,
        },
        "+=0.25"
      );

      tl.from(
        ctaRef.current,
        {
          y: 20,
          opacity: 0,
          duration: 0.45,
        },
        "-=0.2"
      );

      tl.from(
        scrollIndicatorRef.current,
        {
          opacity: 0,
          duration: 0.4,
        },
        "+=0.3"
      );

      gsap.to(scrollIndicatorRef.current, {
        y: 8,
        repeat: -1,
        yoyo: true,
        duration: 1,
        ease: "power1.inOut",
        delay: tl.duration(),
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative min-h-screen flex flex-col items-start justify-center px-6 max-w-6xl mx-auto overflow-hidden"
    >
      <div
        className="absolute inset-0 -z-10 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-accent) 1px, transparent 1px), linear-gradient(90deg, var(--color-accent) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="absolute top-1/4 left-1/4 -z-10 w-96 h-96 rounded-full bg-accent/5 blur-3xl" />

      <div className="w-full max-w-3xl pt-24">
        <p
          ref={greetingRef}
          className="font-mono text-accent text-lg mb-3 tracking-widest opacity-0"
        >
          {data.greeting}
        </p>

        <h1
          ref={nameRef}
          className="text-5xl md:text-7xl font-bold text-text-main mb-4 leading-tight opacity-0"
        >
          {data.name}
          <span className="text-accent">.</span>
        </h1>

        <div className="mb-6 flex flex-col gap-1">
          {data.roles.map((_, i) => (
            <div key={i} className="flex items-center h-9">
              <span className="font-mono text-2xl md:text-3xl text-text-muted">
                <span
                  ref={(el) => { roleRefs.current[i] = el; }}
                  className="text-text-main"
                />
                <span
                  ref={(el) => { cursorRefs.current[i] = el; }}
                  style={{ visibility: "hidden" }}
                  className="inline-block w-0.5 h-6 ml-0.5 bg-accent animate-blink-caret align-middle"
                />
              </span>
            </div>
          ))}
        </div>

        <p
          ref={bioRef}
          className="text-text-muted text-lg leading-relaxed max-w-xl mb-10 opacity-0"
        >
          {data.bio}
        </p>

        <div ref={ctaRef} className="flex flex-wrap gap-4 opacity-0">
          <a
            href={data.cta.primary.href}
            className="inline-flex items-center gap-2 bg-accent text-background font-mono font-semibold px-6 py-3 rounded hover:opacity-80 transition-opacity duration-200"
          >
            {data.cta.primary.label}
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </a>
          <a
            href={data.cta.secondary.href}
            className="inline-flex items-center gap-2 border border-border text-text-main font-mono px-6 py-3 rounded hover:border-accent hover:text-accent transition-colors duration-200"
          >
            {data.cta.secondary.label}
          </a>
        </div>
      </div>

      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0"
      >
        <span className="font-mono text-xs text-text-muted tracking-widest uppercase">
          scroll
        </span>
        <svg
          className="w-5 h-5 text-text-muted"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </section>
  );
}
