"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { SkillsData } from "@/types";

gsap.registerPlugin(ScrollTrigger);

interface SkillsProps {
  data: SkillsData;
}

export default function Skills({ data }: SkillsProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const groupsRef = useRef<HTMLDivElement>(null);

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

      const allTags = groupsRef.current!.querySelectorAll("[data-skill]");
      gsap.from(allTags, {
        y: 20,
        opacity: 0,
        duration: 0.4,
        ease: "power2.out",
        stagger: 0.04,
        scrollTrigger: {
          trigger: groupsRef.current,
          start: "top 80%",
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="py-24 px-6 border-t border-border"
    >
      <div className="max-w-6xl mx-auto">
        <div ref={headingRef} className="mb-14">
          <p className="font-mono text-accent text-sm tracking-widest uppercase mb-2">
            02. {data.eyebrow}
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-text-main">
            {data.title}
          </h2>
        </div>

        <div ref={groupsRef} className="flex flex-col gap-10">
          {data.groups.map((group) => (
            <div key={group.category}>
              <p className="font-mono text-text-muted text-sm tracking-widest uppercase mb-4">
                {group.category}
              </p>
              <div className="flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <span
                    key={skill}
                    data-skill
                    className="font-mono text-sm px-4 py-2 rounded border border-border text-text-main bg-surface hover:border-accent hover:text-accent transition-colors duration-200"
                  >
                    {skill}
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
