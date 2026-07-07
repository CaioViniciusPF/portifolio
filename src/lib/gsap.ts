import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { TextPlugin } from "gsap/TextPlugin";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";

gsap.registerPlugin(
  useGSAP,
  ScrollTrigger,
  SplitText,
  TextPlugin,
  DrawSVGPlugin,
  ScrambleTextPlugin
);
gsap.defaults({ ease: "power3.out", duration: 0.8 });

export { gsap, useGSAP, ScrollTrigger, SplitText };
export const REDUCED = "(prefers-reduced-motion: reduce)";
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";
export const DESKTOP = "(min-width: 768px)";
