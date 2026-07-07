"use client";

import { useRef } from "react";
import { gsap, useGSAP, SplitText, MOTION_OK, REDUCED } from "@/lib/gsap";
import type { SkillsData } from "@/types";

interface SkillsProps {
  data: SkillsData;
}

export default function Skills({ data }: SkillsProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const groupsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(REDUCED, () => {
        gsap.set(groupsRef.current!.querySelectorAll("[data-group]"), {
          opacity: 1,
          y: 0,
        });
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

        gsap.utils.toArray<HTMLElement>("[data-group]").forEach((group) => {
          gsap.from(group, {
            y: 30,
            opacity: 0,
            duration: 0.6,
            scrollTrigger: { trigger: group, start: "top 85%", once: true },
          });

          gsap.from(group.querySelectorAll("[data-skill]"), {
            opacity: 0,
            duration: 0.4,
            stagger: 0.03,
            scrollTrigger: { trigger: group, start: "top 80%", once: true },
          });
        });
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="relative isolate overflow-x-clip py-32 md:py-40 px-6"
    >
      <div
        aria-hidden
        className="absolute -z-10 pointer-events-none top-1/4 -right-48 w-[38rem] h-[38rem] opacity-[0.09] bg-[radial-gradient(closest-side,var(--color-accent),transparent_72%)]"
      />
      <div
        aria-hidden
        className="absolute -z-10 pointer-events-none bottom-0 -left-40 w-[30rem] h-[30rem] opacity-[0.07] bg-[radial-gradient(closest-side,var(--color-primary),transparent_72%)]"
      />
      <div className="max-w-6xl mx-auto">
        <h2
          ref={headingRef}
          className="font-display font-bold text-text-main text-5xl md:text-7xl tracking-[-0.02em] mb-16 md:mb-20"
        >
          {data.title}
        </h2>

        <div ref={groupsRef} className="flex flex-col">
          {data.groups.map((group) => (
            <div
              key={group.category}
              data-group
              className="flex flex-col md:flex-row md:items-baseline gap-3 md:gap-8 py-8 border-b border-border"
            >
              <h3 className="font-display font-bold text-2xl md:text-4xl text-text-main md:w-64 md:flex-shrink-0">
                {group.category}
              </h3>
              <div className="flex flex-wrap gap-x-3 gap-y-2">
                {group.skills.map((skill, i) => (
                  <span
                    key={skill}
                    data-skill
                    className="font-mono text-base md:text-lg text-text-muted hover:text-accent transition-colors duration-200"
                  >
                    {skill}
                    {i < group.skills.length - 1 ? " /" : ""}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
