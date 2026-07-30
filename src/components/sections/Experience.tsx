"use client";

import { useRef } from "react";
import {
  gsap,
  useGSAP,
  ScrollTrigger,
  SplitText,
  MOTION_OK,
  REDUCED,
} from "@/lib/gsap";
import type { ExperienceData, EducationItem } from "@/types";

interface ExperienceProps {
  data: ExperienceData;
  education: EducationItem[];
}

export default function Experience({ data, education }: ExperienceProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<SVGPathElement>(null);
  const educationRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const timeline = timelineRef.current!;
      const progress = progressRef.current!;

      const syncRail = () => {
        const h = timeline.offsetHeight;
        if (h) progress.setAttribute("d", `M2,0 L2,${h}`);
      };

      syncRail();
      ScrollTrigger.addEventListener("refreshInit", syncRail);

      let firstResize = true;
      const ro = new ResizeObserver(() => {
        if (firstResize) {
          firstResize = false;
          return;
        }
        ScrollTrigger.refresh();
      });
      ro.observe(timeline);

      const mm = gsap.matchMedia();

      mm.add(REDUCED, () => {
        gsap.set(progress, { drawSVG: "100%" });
        gsap.set(timeline.querySelectorAll("[data-dot]"), { scale: 1 });
        gsap.set(educationRef.current, { autoAlpha: 1, y: 0 });
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

        gsap.fromTo(
          progress,
          { drawSVG: "0%" },
          {
            drawSVG: "100%",
            ease: "none",
            scrollTrigger: {
              trigger: timeline,
              start: "top 70%",
              end: "bottom 70%",
              scrub: 0.5,
              invalidateOnRefresh: true,
            },
          }
        );

        gsap.utils
          .toArray<HTMLElement>("[data-item]", timeline)
          .forEach((item) => {
            const dot = item.querySelector("[data-dot]");
            const period = item.querySelector<HTMLElement>("[data-period]");
            const periodText = period?.textContent ?? "";

            const tl = gsap.timeline({
              scrollTrigger: { trigger: item, start: "top 80%", once: true },
            });

            tl.from(item, {
              y: 24,
              autoAlpha: 0,
              duration: 0.7,
              ease: "power3.out",
            }).fromTo(
              dot,
              { scale: 0 },
              { scale: 1, duration: 0.55, ease: "back.out(3)" },
              0.15
            );

            if (period) {
              tl.to(
                period,
                {
                  duration: 0.9,
                  ease: "none",
                  scrambleText: {
                    text: periodText,
                    chars: "0123456789",
                    speed: 0.4,
                  },
                },
                0
              );
            }
          });

        gsap.from(educationRef.current, {
          y: 24,
          autoAlpha: 0,
          duration: 0.6,
          scrollTrigger: {
            trigger: educationRef.current,
            start: "top 85%",
            once: true,
          },
        });
      });

      return () => {
        ScrollTrigger.removeEventListener("refreshInit", syncRail);
        ro.disconnect();
      };
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="relative isolate py-32 md:py-40 px-6"
    >
      <div
        aria-hidden
        className="absolute -z-10 pointer-events-none top-1/3 -left-52 w-[38rem] h-[38rem] opacity-[0.09] bg-[radial-gradient(closest-side,var(--color-primary),transparent_72%)]"
      />
      <div
        aria-hidden
        className="absolute -z-10 pointer-events-none top-10 right-0 w-[26rem] h-[26rem] opacity-[0.07] bg-[radial-gradient(closest-side,var(--color-accent),transparent_72%)]"
      />
      <div className="max-w-6xl mx-auto">
        <h2
          ref={headingRef}
          className="font-display font-bold text-text-main text-5xl md:text-7xl tracking-[-0.02em] mb-16 md:mb-20"
        >
          {data.title}
        </h2>

        <div ref={timelineRef} className="relative flex flex-col gap-0">
          <div
            aria-hidden
            className="pointer-events-none absolute left-[1.5px] top-0 w-px h-full bg-border"
          />
          <svg
            aria-hidden
            className="pointer-events-none absolute left-0 top-0 w-1 h-full"
          >
            <path
              ref={progressRef}
              d="M2,0 L2,0"
              fill="none"
              className="stroke-accent"
              strokeWidth={2}
            />
          </svg>

          {data.items.map((item, i) => (
            <div key={i} data-item className="relative pl-8 pb-12 last:pb-0">
              <span
                data-dot
                className="absolute -left-[3px] top-1 w-2.5 h-2.5 rounded-full bg-accent scale-0"
              />

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1">
                <h3 className="text-xl font-bold text-text-main">{item.role}</h3>
                <span data-period className="font-mono text-accent text-sm">
                  {item.period}
                </span>
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
            {data.educationTitle}
          </p>
          {education.map((e, i) => (
            <div
              key={i}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1"
            >
              <div>
                <h3 className="text-lg font-bold text-text-main">{e.degree}</h3>
                <p className="font-mono text-text-muted text-sm">
                  {e.institution}
                </p>
              </div>
              <span className="font-mono text-accent text-sm">{e.period}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
