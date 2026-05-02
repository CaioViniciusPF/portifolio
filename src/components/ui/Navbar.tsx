"use client";

import { useRef, useEffect, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import type { NavLink } from "@/types";

let hasAnimated = false;

interface NavbarProps {
  links: NavLink[];
}

export default function Navbar({ links }: NavbarProps) {
  const navRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useGSAP(
    () => {
      if (hasAnimated) {
        gsap.set(navRef.current, { y: 0, opacity: 1 });
        return;
      }
      hasAnimated = true;
      gsap.to(navRef.current, {
        y: 0,
        opacity: 1,
        duration: 1.6,
        ease: "power3.out",
        delay: 0.8,
      });
    },
    { scope: navRef, dependencies: [] }
  );

  return (
    <nav
      ref={navRef}
      style={{ opacity: 0, transform: "translateY(-60px)" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/90 backdrop-blur-md border-b border-border/20 shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <a
          href="#"
          className="font-mono text-accent font-bold text-lg tracking-wider hover:opacity-80 transition-opacity"
        >
          &lt;CV /&gt;
        </a>

        <ul className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="font-mono text-sm text-text-muted hover:text-accent transition-colors duration-200 relative group"
              >
                <span className="text-accent/60 mr-1 text-xs">
                  {String(links.indexOf(link) + 1).padStart(2, "0")}.
                </span>
                {link.label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-accent transition-all duration-300 group-hover:w-full" />
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#contact"
          className="hidden md:inline-flex font-mono text-sm border border-accent text-accent px-4 py-2 rounded hover:bg-accent/10 transition-colors duration-200"
        >
          Currículo
        </a>
      </div>
    </nav>
  );
}
