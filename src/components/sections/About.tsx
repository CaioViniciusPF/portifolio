"use client";

import { useRef } from "react";
import { gsap, useGSAP, SplitText, MOTION_OK, DESKTOP, REDUCED } from "@/lib/gsap";
import type { AboutData } from "@/types";

interface AboutProps {
  data: AboutData;
}

export default function About({ data }: AboutProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const paragraphsRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(REDUCED, () => {
        gsap.set(statsRef.current!.children, { opacity: 1, y: 0 });
      });

      mm.add(MOTION_OK, () => {
        const split = SplitText.create(headingRef.current, {
          type: "chars, words",
          mask: "chars",
        });
        gsap.from(split.chars, {
          yPercent: 110,
          duration: 0.8,
          ease: "power4.out",
          stagger: 0.03,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            once: true,
          },
        });

        gsap.from(statsRef.current!.children, {
          y: 20,
          opacity: 0,
          duration: 0.6,
          stagger: 0.08,
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 85%",
            once: true,
          },
        });
      });

      mm.add(`${MOTION_OK} and ${DESKTOP}`, () => {
        const lineSplit = SplitText.create(
          paragraphsRef.current!.querySelectorAll("p"),
          { type: "lines", mask: "lines" }
        );

        lineSplit.lines.forEach((line) => {
          gsap.fromTo(
            line,
            { opacity: 0.15 },
            {
              opacity: 1,
              ease: "none",
              scrollTrigger: {
                trigger: line,
                start: "top 85%",
                end: "top 55%",
                scrub: true,
              },
            }
          );
        });
      });

      mm.add(`${MOTION_OK} and (max-width: 767px)`, () => {
        gsap.from(paragraphsRef.current!.children, {
          y: 24,
          opacity: 0,
          duration: 0.6,
          stagger: 0.12,
          scrollTrigger: {
            trigger: paragraphsRef.current,
            start: "top 85%",
            once: true,
          },
        });
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative isolate py-32 md:py-40 px-6"
    >
      <div
        aria-hidden
        className="absolute -z-10 pointer-events-none top-24 -left-56 w-[36rem] h-[36rem] opacity-10 bg-[radial-gradient(closest-side,var(--color-accent),transparent_72%)]"
      />
      <div
        aria-hidden
        className="absolute -z-10 pointer-events-none bottom-10 right-0 w-[28rem] h-[28rem] opacity-[0.08] bg-[radial-gradient(closest-side,var(--color-primary),transparent_72%)]"
      />
      <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4">
          <h2
            ref={headingRef}
            className="font-display font-bold text-text-main text-5xl md:text-6xl tracking-[-0.02em] lg:sticky lg:top-32"
          >
            {data.title}
          </h2>
        </div>

        <div className="lg:col-span-8 flex flex-col gap-16">
          <div ref={paragraphsRef} className="flex flex-col gap-6">
            {data.paragraphs.map((p, i) => (
              <p
                key={i}
                className="text-text-muted leading-relaxed text-lg md:text-xl max-w-[60ch]"
              >
                {p}
              </p>
            ))}
          </div>

          <div
            ref={statsRef}
            className="grid grid-cols-2 md:grid-cols-4 border-y border-border"
          >
            {data.highlights.map((h) => (
              <div
                key={h.label}
                className="flex flex-col gap-1 min-w-0 px-4 py-6 border-border even:border-l md:border-l md:first:border-l-0 md:first:pl-0 [&:nth-child(-n+2)]:border-b md:[&:nth-child(-n+2)]:border-b-0"
              >
                <p className="font-display font-bold text-text-main text-xl md:text-2xl break-words">
                  {h.value}
                </p>
                <p className="font-mono text-text-muted text-xs tracking-widest uppercase">
                  {h.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
