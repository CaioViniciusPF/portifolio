"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP, SplitText, MOTION_OK } from "@/lib/gsap";
import type { ProjectsData } from "@/types";

interface ProjectsProps {
  data: ProjectsData;
}

export default function Projects({ data }: ProjectsProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        const split = SplitText.create(headingRef.current, {
          type: "chars, words",
          mask: "chars",
        });
        gsap.from(split.chars, {
          yPercent: 110,
          duration: 0.8,
          ease: "power4.out",
          stagger: 0.04,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            once: true,
          },
        });

        gsap.utils.toArray<HTMLElement>("[data-drift]").forEach((drift) => {
          gsap.to(drift, {
            xPercent: 5,
            duration: 7,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut",
          });
        });
      });

      mm.add(`${MOTION_OK} and (min-width: 768px)`, () => {
        const track = trackRef.current!;
        const getAmount = () => track.scrollWidth - window.innerWidth;

        const scrollTween = gsap.to(track, {
          x: () => -getAmount(),
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: () => "+=" + getAmount(),
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });

        gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
          gsap.fromTo(
            el,
            { xPercent: -5 },
            {
              xPercent: 5,
              ease: "none",
              scrollTrigger: {
                trigger: el.parentElement,
                containerAnimation: scrollTween,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            }
          );
        });
      });

      mm.add(`${MOTION_OK} and (max-width: 767px)`, () => {
        gsap.utils.toArray<HTMLElement>("[data-row]").forEach((row) => {
          const media = row.querySelector<HTMLElement>("[data-media]");
          const meta = row.querySelector<HTMLElement>("[data-meta]");

          if (media) {
            gsap.fromTo(
              media,
              { clipPath: "inset(0% 0% 100% 0%)" },
              {
                clipPath: "inset(0% 0% 0% 0%)",
                duration: 1.1,
                ease: "power3.inOut",
                scrollTrigger: { trigger: row, start: "top 75%", once: true },
              }
            );
          }

          if (meta) {
            gsap.from(meta, {
              y: 30,
              opacity: 0,
              duration: 0.7,
              scrollTrigger: { trigger: row, start: "top 70%", once: true },
            });
          }
        });
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="md:h-screen md:flex md:flex-col md:overflow-hidden motion-reduce:!h-auto motion-reduce:!overflow-visible"
    >
      <div className="w-full max-w-6xl mx-auto px-6 pt-32 md:pt-36">
        <h2
          ref={headingRef}
          className="font-display font-bold text-text-main text-5xl md:text-7xl tracking-[-0.02em]"
        >
          {data.title}
        </h2>
      </div>

      <div
        ref={trackRef}
        className="flex flex-col md:flex-row md:items-center md:flex-1 md:min-h-0 md:w-max md:pl-[10vw] motion-reduce:!flex-col motion-reduce:!w-auto motion-reduce:!pl-0"
      >
        {data.items.map((item, i) => (
          <article
            key={item.title}
            data-row
            className="group grid grid-cols-1 md:grid-cols-12 items-center gap-8 md:gap-[3vw] px-6 py-14 md:py-0 md:px-[5vw] md:w-[80vw] md:flex-shrink-0 motion-reduce:!grid-cols-1 motion-reduce:!w-auto"
          >
            <div
              data-media
              className="relative w-full overflow-hidden bg-surface aspect-[16/10] md:col-span-7"
            >
              {item.image ? (
                <div data-parallax className="absolute inset-0 scale-110">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover grayscale-[0.3] transition-[filter,transform] duration-700 ease-out-expo group-hover:grayscale-0 group-hover:scale-[1.03]"
                  />
                </div>
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-accent/15 to-surface flex items-center justify-center overflow-hidden">
                  <span
                    data-drift
                    className="font-display font-bold text-[clamp(3.5rem,10vw,8rem)] text-transparent [-webkit-text-stroke:1.5px_var(--color-accent)] whitespace-nowrap opacity-60"
                  >
                    {item.title}
                  </span>
                </div>
              )}
            </div>

            <div data-meta className="relative md:col-span-5">
              <span
                aria-hidden
                className="pointer-events-none select-none absolute -top-6 -left-3 md:-top-36 md:-left-8 font-display font-bold leading-none text-[6rem] md:text-[13rem] text-text-main opacity-[0.08]"
              >
                {String(i + 1).padStart(2, "0")}
              </span>

              <div className="relative flex flex-col gap-4">
                <p className="flex items-center gap-3 font-mono text-xs text-accent/70 tracking-widest uppercase">
                  <span className="h-px w-8 bg-accent/70" />
                  {item.context}
                </p>
                <h3 className="font-display font-bold text-text-main text-4xl md:text-5xl tracking-[-0.02em]">
                  <span className="inline-block transition-transform duration-300 ease-out-expo group-hover:translate-x-2">
                    {item.title}
                  </span>
                </h3>
                <p className="text-text-muted leading-relaxed max-w-[45ch]">
                  {item.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {item.tech.map((t) => (
                    <span
                      key={t}
                      className="font-mono text-xs px-2 py-0.5 rounded border border-border text-text-muted"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                {(item.link || item.github) && (
                  <div className="flex gap-6 pt-1">
                    {item.github && (
                      <a
                        href={`https://${item.github}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative group/link font-mono text-sm text-text-main hover:text-accent transition-colors duration-200"
                      >
                        GitHub
                        <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-accent transition-all duration-300 group-hover/link:w-full" />
                      </a>
                    )}
                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative group/link font-mono text-sm text-text-main hover:text-accent transition-colors duration-200"
                      >
                        {data.viewSiteLabel}
                        <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-accent transition-all duration-300 group-hover/link:w-full" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
