"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ExperienceItem, EducationItem } from "@/types";

gsap.registerPlugin(ScrollTrigger);

interface ExperienceProps {
  data: ExperienceItem[];
  education: EducationItem[];
}

export default function Experience({ data, education }: ExperienceProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const educationRef = useRef<HTMLDivElement>(null);

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

      gsap.from(timelineRef.current!.children, {
        y: 40,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.15,
        scrollTrigger: {
          trigger: timelineRef.current,
          start: "top 80%",
        },
      });

      gsap.from(educationRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: educationRef.current,
          start: "top 85%",
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="py-24 px-6 border-t border-border"
    >
      <div className="max-w-6xl mx-auto">
        <div ref={headingRef} className="mb-14">
          <p className="font-mono text-accent text-sm tracking-widest uppercase mb-2">
            03. experiência
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-text-main">
            Experiência
          </h2>
        </div>

        <div ref={timelineRef} className="flex flex-col gap-0">
          {data.map((item, i) => (
            <div
              key={i}
              className="relative pl-8 pb-12 border-l border-border last:pb-0"
            >
              <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-accent" />

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1">
                <h3 className="text-xl font-bold text-text-main">{item.role}</h3>
                <span className="font-mono text-accent text-sm">{item.period}</span>
              </div>

              <p className="font-mono text-text-muted text-sm mb-4">
                {item.company} · {item.location}
              </p>

              <ul className="flex flex-col gap-1.5 mb-4">
                {item.description.map((d, j) => (
                  <li key={j} className="text-text-muted flex gap-2">
                    <span className="text-accent mt-1 shrink-0">▸</span>
                    {d}
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-2">
                {item.tech.map((t) => (
                  <span
                    key={t}
                    className="font-mono text-xs px-2.5 py-1 rounded border border-border text-text-muted"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div ref={educationRef} className="mt-16 pt-12 border-t border-border">
          <p className="font-mono text-text-muted text-sm tracking-widest uppercase mb-6">
            Formação
          </p>
          {education.map((e, i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <div>
                <h3 className="text-lg font-bold text-text-main">{e.degree}</h3>
                <p className="font-mono text-text-muted text-sm">{e.institution}</p>
              </div>
              <span className="font-mono text-accent text-sm">{e.period}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
