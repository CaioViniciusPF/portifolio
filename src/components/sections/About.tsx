"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import type { AboutData } from "@/types";

interface AboutProps {
  data: AboutData;
}

export default function About({ data }: AboutProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const highlightsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(headingRef.current, {
        y: 40,
        opacity: 0,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 85%",
        },
      });

      gsap.from(contentRef.current, {
        y: 40,
        opacity: 0,
        duration: 0.7,
        ease: "power2.out",
        delay: 0.15,
        scrollTrigger: {
          trigger: contentRef.current,
          start: "top 85%",
        },
      });

      gsap.from(highlightsRef.current!.children, {
        y: 30,
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: highlightsRef.current,
          start: "top 85%",
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="about"
      className="py-24 px-6 border-t border-border"
    >
      <div className="max-w-6xl mx-auto">
        <div ref={headingRef} className="mb-14">
          <p className="font-mono text-accent text-sm tracking-widest uppercase mb-2">
            01. {data.eyebrow}
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-text-main">
            {data.title}
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div ref={contentRef} className="flex flex-col gap-4">
            {data.paragraphs.map((p, i) => (
              <p key={i} className="text-text-muted leading-relaxed text-lg">
                {p}
              </p>
            ))}
          </div>

          <div
            ref={highlightsRef}
            className="grid grid-cols-2 gap-4 h-fit"
          >
            {data.highlights.map((h) => (
              <div
                key={h.label}
                className="bg-surface border border-border rounded-lg p-5"
              >
                <p className="font-mono text-accent text-xs tracking-widest uppercase mb-1">
                  {h.label}
                </p>
                <p className="text-text-main font-semibold">{h.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
