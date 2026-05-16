"use client";

import { useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
import Image from "next/image";
import type { HeroData } from "@/types";

gsap.registerPlugin(TextPlugin);

interface HeroProps {
  data: HeroData;
}

export default function Hero({ data }: HeroProps) {
  const containerRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);

  const greetingRef = useRef<HTMLSpanElement>(null);
  const cursor0Ref = useRef<HTMLSpanElement>(null);

  const nameRef = useRef<HTMLSpanElement>(null);
  const nameDotRef = useRef<HTMLSpanElement>(null);
  const cursor1Ref = useRef<HTMLSpanElement>(null);

  const roleRef = useRef<HTMLSpanElement>(null);
  const cursor2Ref = useRef<HTMLSpanElement>(null);

  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  const role = data.roles[0] ?? "";

  useEffect(() => {
    const onResize = () => {
      const photo = photoRef.current;
      if (!photo || window.innerWidth < 768) return;
      const currentOpacity = gsap.getProperty(photo, "opacity") as number;
      if (currentOpacity < 1) {
        gsap.to(photo, { autoAlpha: 1, x: 0, duration: 0.5, ease: "power2.out" });
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useGSAP(
    () => {
      const isDesktop = window.innerWidth >= 768;
      const tl = gsap.timeline();

      gsap.set(
        [cursor0Ref.current, cursor1Ref.current, cursor2Ref.current],
        { visibility: "hidden" }
      );
      gsap.set(textRef.current, { textAlign: "center" });
      gsap.set(ctaRef.current, { autoAlpha: 0 });

      if (isDesktop) {
        const shift = (photoRef.current!.offsetWidth + 64) / 2;
        gsap.set(textRef.current, { x: shift });
        gsap.set(photoRef.current, { x: 40, opacity: 0 });
      }

      tl.set(cursor0Ref.current, { visibility: "visible" });
      tl.to(greetingRef.current, {
        duration: data.greeting.length * 0.09,
        text: { value: data.greeting, delimiter: "" },
        ease: "none",
      });

      tl.set(cursor0Ref.current, { visibility: "hidden" }, "+=0.15");
      tl.set(cursor1Ref.current, { visibility: "visible" }, "<");
      tl.to(
        nameRef.current,
        {
          duration: data.name.length * 0.09,
          text: { value: data.name, delimiter: "" },
          ease: "none",
        },
        "<"
      );
      tl.fromTo(nameDotRef.current, { opacity: 0 }, { opacity: 1, duration: 0.2 });

      tl.set(cursor1Ref.current, { visibility: "hidden" }, "+=0.15");
      tl.set(cursor2Ref.current, { visibility: "visible" }, "<");
      tl.to(
        roleRef.current,
        {
          duration: role.length * 0.055,
          text: { value: role, delimiter: "" },
          ease: "none",
        },
        "<"
      );

      tl.addLabel("transition", "+=0.5");

      tl.call(
        () => {
          const containerRect = textRef.current!.getBoundingClientRect();
          const anchorRect = greetingRef.current!.getBoundingClientRect();
          const centerOffset = anchorRect.left - containerRect.left;
          const currentX = gsap.getProperty(textRef.current, "x") as number;
          gsap.set(textRef.current, {
            x: currentX + centerOffset,
            textAlign: "left",
          });
        },
        [],
        "transition"
      );

      tl.to(
        textRef.current,
        { x: 0, duration: 0.9, ease: "power3.inOut" },
        "transition"
      );

      if (isDesktop) {
        tl.to(
          photoRef.current,
          { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" },
          "transition+=0.2"
        );
      }

      tl.fromTo(
        ctaRef.current,
        { y: 20, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.5 },
        "transition+=1.0"
      );

      tl.call(
        () => window.dispatchEvent(new CustomEvent("hero:ready")),
        [],
        "transition+=1.0"
      );

      tl.fromTo(
        scrollIndicatorRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4 },
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
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
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

      <div className="w-full max-w-6xl px-6 flex items-center gap-16 pt-24 pb-24">
        <div ref={textRef} className="flex-1 min-w-0">
          <p className="text-5xl md:text-7xl font-bold text-text-main mb-4 leading-tight">
            <span ref={greetingRef} />
            <span
              ref={cursor0Ref}
              style={{ visibility: "hidden" }}
              className="inline-block w-0.5 h-10 md:h-16 ml-0.5 bg-accent animate-blink-caret align-middle"
            />
          </p>

          <h1 className="text-5xl md:text-7xl font-bold text-text-main mb-4 leading-tight">
            <span ref={nameRef} />
            <span ref={nameDotRef} className="text-accent opacity-0">.</span>
            <span
              ref={cursor1Ref}
              style={{ visibility: "hidden" }}
              className="inline-block w-0.5 h-10 md:h-16 ml-0.5 bg-accent animate-blink-caret align-middle"
            />
          </h1>

          <div className="mb-10 min-h-9">
            <span className="font-mono text-xl md:text-2xl text-text-muted">
              <span ref={roleRef} className="text-text-main" />
              <span
                ref={cursor2Ref}
                style={{ visibility: "hidden" }}
                className="inline-block w-0.5 h-5 ml-0.5 bg-accent animate-blink-caret align-middle"
              />
            </span>
          </div>

          <div ref={ctaRef} className="flex flex-wrap gap-4">
            <a
              href={data.cta.primary.href}
              className="inline-flex items-center gap-2 bg-accent text-background font-mono font-semibold px-6 py-3 rounded hover:opacity-80 transition-opacity duration-200"
            >
              {data.cta.primary.label}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
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
          ref={photoRef}
          className="hidden md:flex flex-shrink-0 w-72 h-80 rounded-2xl border border-border bg-surface items-center justify-center overflow-hidden opacity-0"
        >
          {data.photo ? (
            <div className="relative w-full h-full">
              <Image src={data.photo} alt={data.name} fill className="object-cover" />
            </div>
          ) : (
            <span className="font-mono text-4xl text-text-muted">CV</span>
          )}
        </div>
      </div>

      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0"
      >
        <span className="font-mono text-xs text-text-muted tracking-widest uppercase">
          scroll
        </span>
        <svg className="w-5 h-5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}
