"use client";

import { useEffect, useState } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import { gsap, ScrollTrigger, REDUCED } from "@/lib/gsap";

function GsapTickerDriver() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    lenis.on("scroll", ScrollTrigger.update);
    const update = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off("scroll", ScrollTrigger.update);
      gsap.ticker.remove(update);
    };
  }, [lenis]);

  return null;
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [reduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia(REDUCED).matches
  );

  if (reduced) return <>{children}</>;

  return (
    <ReactLenis
      root
      options={{
        autoRaf: false,
        duration: 1.1,
        anchors: { offset: -80 },
      }}
    >
      <GsapTickerDriver />
      {children}
    </ReactLenis>
  );
}
