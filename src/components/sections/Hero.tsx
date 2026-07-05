"use client";

import { useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { gsap, useGSAP, SplitText, MOTION_OK, REDUCED } from "@/lib/gsap";
import type { HeroData } from "@/types";

const HeroParticles = dynamic(() => import("@/components/three/HeroParticles"), {
  ssr: false,
});

interface HeroProps {
  data: HeroData;
}

export default function Hero({ data }: HeroProps) {
  const containerRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  const greetingRef = useRef<HTMLSpanElement>(null);
  const cursor0Ref = useRef<HTMLSpanElement>(null);

  const nameLine1Ref = useRef<HTMLSpanElement>(null);
  const nameLine2Ref = useRef<HTMLSpanElement>(null);
  const nameDotRef = useRef<HTMLSpanElement>(null);

  const roleRef = useRef<HTMLSpanElement>(null);
  const cursor2Ref = useRef<HTMLSpanElement>(null);

  const ctaRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const photoFrameRef = useRef<HTMLDivElement>(null);
  const photoMaskRef = useRef<HTMLDivElement>(null);
  const photoInnerRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const scrollFillRef = useRef<HTMLSpanElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const role = data.roles[0] ?? "";
  const [firstName, ...restName] = data.name.split(" ");
  const lastName = restName.join(" ");

  useEffect(() => {
    const ensurePhotoVisible = () => {
      if (window.innerWidth < 768) return;
      const mask = photoMaskRef.current;
      if (!mask) return;
      const clip = gsap.getProperty(mask, "clipPath") as string;
      if (clip && clip !== "none" && !clip.includes("0%")) return;
      gsap.set(photoMaskRef.current, { clipPath: "inset(0% 0% 0% 0%)" });
      gsap.set(photoInnerRef.current, { scale: 1 });
      gsap.set(photoFrameRef.current, { autoAlpha: 1 });
    };

    const onResize = () => {
      if ((tlRef.current?.progress() ?? 1) < 1) return;
      ensurePhotoVisible();
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(REDUCED, () => {
        if (greetingRef.current) greetingRef.current.textContent = data.greeting;
        if (roleRef.current) roleRef.current.textContent = role;
        gsap.set(scrollIndicatorRef.current, { opacity: 1 });
        gsap.delayedCall(0.2, () =>
          window.dispatchEvent(new CustomEvent("hero:ready"))
        );
      });

      mm.add(MOTION_OK, () => {
        const isDesktop = window.innerWidth >= 768;
        const tl = gsap.timeline();
        tlRef.current = tl;

        const nameTargets = [nameLine1Ref.current, nameLine2Ref.current].filter(
          Boolean
        ) as HTMLElement[];
        const split = SplitText.create(nameTargets, {
          type: "chars",
          mask: "chars",
        });

        gsap.set([cursor0Ref.current, cursor2Ref.current], {
          visibility: "hidden",
        });
        gsap.set(ctaRef.current, { autoAlpha: 0 });
        gsap.set(split.chars, { yPercent: 110 });
        gsap.set(nameDotRef.current, { scale: 0, autoAlpha: 0 });

        if (isDesktop) {
          const shift = (photoRef.current!.offsetWidth + 64) / 2;
          gsap.set(textRef.current, { x: shift });
          gsap.set(photoMaskRef.current, { clipPath: "inset(100% 0% 0% 0%)" });
          gsap.set(photoInnerRef.current, { scale: 1.15 });
          gsap.set(photoFrameRef.current, { autoAlpha: 0 });
        }

        tl.set(cursor0Ref.current, { visibility: "visible" });
        tl.to(greetingRef.current, {
          duration: data.greeting.length * 0.06,
          text: { value: data.greeting, delimiter: "" },
          ease: "none",
        });
        tl.set(cursor0Ref.current, { visibility: "hidden" }, "+=0.15");

        tl.to(
          split.chars,
          {
            yPercent: 0,
            duration: 0.9,
            ease: "power4.out",
            stagger: 0.035,
          },
          "<"
        );
        tl.to(
          nameDotRef.current,
          { scale: 1, autoAlpha: 1, duration: 0.4, ease: "back.out(2.5)" },
          ">-0.35"
        );

        tl.set(cursor2Ref.current, { visibility: "visible" });
        tl.to(roleRef.current, {
          duration: role.length * 0.035,
          text: { value: role, delimiter: "" },
          ease: "none",
        });

        tl.addLabel("transition", "+=0.4");

        tl.to(
          textRef.current,
          { x: 0, duration: 0.9, ease: "power3.inOut" },
          "transition"
        );

        if (isDesktop) {
          tl.to(
            photoMaskRef.current,
            {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 1,
              ease: "power3.inOut",
            },
            "transition+=0.2"
          );
          tl.to(
            photoInnerRef.current,
            { scale: 1, duration: 1.2, ease: "power3.out" },
            "transition+=0.2"
          );
          tl.to(
            photoFrameRef.current,
            { autoAlpha: 1, duration: 0.5 },
            "transition+=0.8"
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

        gsap
          .timeline({ repeat: -1, repeatDelay: 0.4, delay: tl.duration() })
          .fromTo(
            scrollFillRef.current,
            { scaleY: 0, transformOrigin: "top center" },
            { scaleY: 1, duration: 0.7, ease: "power2.in" }
          )
          .to(scrollFillRef.current, {
            scaleY: 0,
            transformOrigin: "bottom center",
            duration: 0.7,
            ease: "power2.out",
          });

        if (isDesktop) {
          const exitScrub = {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          };
          gsap.to(textRef.current, {
            yPercent: -12,
            ease: "none",
            scrollTrigger: exitScrub,
          });
          gsap.to(photoInnerRef.current, {
            yPercent: 8,
            ease: "none",
            scrollTrigger: exitScrub,
          });
          gsap.to(particlesRef.current, {
            opacity: 0.3,
            ease: "none",
            scrollTrigger: exitScrub,
          });
        }
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

      <div ref={particlesRef} className="absolute inset-0 -z-10">
        <HeroParticles />
      </div>

      <div className="w-full max-w-6xl px-6 flex items-center gap-16 pt-24 pb-24">
        <div ref={textRef} className="flex-1 min-w-0">
          <p className="font-mono text-base md:text-lg text-accent mb-6">
            <span ref={greetingRef} />
            <span
              ref={cursor0Ref}
              style={{ visibility: "hidden" }}
              className="inline-block w-0.5 h-4 md:h-5 ml-0.5 bg-accent animate-blink-caret align-middle"
            />
          </p>

          <h1 className="font-display font-bold text-text-main mb-8 leading-[0.95] tracking-[-0.03em] text-[clamp(3.5rem,12vw,8rem)]">
            <span className="block">
              <span ref={nameLine1Ref} className="inline-block">
                {firstName}
              </span>
            </span>
            {lastName && (
              <span className="block">
                <span ref={nameLine2Ref} className="inline-block">
                  {lastName}
                </span>
                <span ref={nameDotRef} className="inline-block text-accent">
                  .
                </span>
              </span>
            )}
          </h1>

          <div className="mb-10 min-h-9 max-w-xl">
            <span className="font-mono text-lg md:text-xl text-text-muted">
              <span ref={roleRef} />
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

        <div ref={photoRef} className="hidden md:block relative flex-shrink-0 w-72 h-80">
          <div
            ref={photoFrameRef}
            className="absolute -bottom-3 -right-3 w-full h-full bg-accent"
          />
          <div
            ref={photoMaskRef}
            className="relative w-full h-full overflow-hidden bg-surface"
          >
            {data.photo ? (
              <div ref={photoInnerRef} className="relative w-full h-full">
                <Image
                  src={data.photo}
                  alt={data.name}
                  fill
                  className="object-cover grayscale hover:grayscale-0 transition-[filter] duration-500"
                />
              </div>
            ) : (
              <span className="font-mono text-4xl text-text-muted flex items-center justify-center w-full h-full">
                CV
              </span>
            )}
          </div>
        </div>
      </div>

      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-0"
      >
        <span className="font-mono text-xs text-text-muted tracking-widest uppercase">
          {data.scrollLabel}
        </span>
        <span className="relative block h-12 w-px bg-border overflow-hidden">
          <span ref={scrollFillRef} className="absolute inset-0 bg-accent" />
        </span>
      </div>
    </section>
  );
}
