"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import type { ProjectsData } from "@/types";

gsap.registerPlugin(ScrollTrigger);

interface ProjectsProps {
  data: ProjectsData;
}

const GRADIENTS = [
  "from-accent/20 to-surface",
  "from-primary/20 to-surface",
  "from-secondary/20 to-surface",
];

export default function Projects({ data }: ProjectsProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

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

      gsap.from(gridRef.current!.children, {
        y: 40,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.12,
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 80%",
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="py-24 px-6 border-t border-border"
    >
      <div className="max-w-6xl mx-auto">
        <div ref={headingRef} className="mb-14">
          <p className="font-mono text-accent text-sm tracking-widest uppercase mb-2">
            03. {data.eyebrow}
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-text-main">
            {data.title}
          </h2>
        </div>

        <div
          ref={gridRef}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {data.items.map((item, i) => (
            <article
              key={item.title}
              className="flex flex-col bg-surface border border-border rounded-lg overflow-hidden hover:border-accent/50 transition-colors duration-300"
            >
              <div className="relative aspect-video overflow-hidden">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div
                    className={`w-full h-full bg-gradient-to-br ${GRADIENTS[i % GRADIENTS.length]} flex items-center justify-center`}
                  >
                    <span className="font-mono text-6xl font-bold text-accent/25">
                      {item.title.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-col flex-1 p-5 gap-3">
                <div>
                  <p className="font-mono text-accent/70 text-xs tracking-widest uppercase mb-1">
                    {item.context}
                  </p>
                  <h3 className="text-lg font-bold text-text-main">
                    {item.title}
                  </h3>
                </div>

                <p className="text-text-muted text-sm leading-relaxed flex-1">
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
                  <div className="flex gap-4 pt-2 border-t border-border">
                    {item.github && (
                      <a
                        href={`https://${item.github}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-xs text-text-muted hover:text-accent transition-colors duration-200 flex items-center gap-1.5"
                      >
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                        </svg>
                        GitHub
                      </a>
                    )}
                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-xs text-text-muted hover:text-accent transition-colors duration-200 flex items-center gap-1.5"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        {data.viewSiteLabel}
                      </a>
                    )}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
