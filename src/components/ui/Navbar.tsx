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
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

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

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav
        ref={navRef}
        style={{ opacity: 0, transform: "translateY(-60px)" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || menuOpen
            ? "bg-background/95 backdrop-blur-md border-b border-border/20 shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <a
            href="#"
            onClick={closeMenu}
            className="font-mono text-accent font-bold text-lg tracking-wider hover:opacity-80 transition-opacity"
          >
            &lt;Portfólio /&gt;
          </a>

          <ul className="hidden lg:flex items-center gap-8">
            {links.map((link, i) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="font-mono text-sm text-text-muted hover:text-accent transition-colors duration-200 relative group"
                >
                  <span className="text-accent/60 mr-1 text-xs">
                    {String(i + 1).padStart(2, "0")}.
                  </span>
                  {link.label}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-accent transition-all duration-300 group-hover:w-full" />
                </a>
              </li>
            ))}
          </ul>

          <a
            href="#contact"
            className="hidden lg:inline-flex font-mono text-sm border border-accent text-accent px-4 py-2 rounded hover:bg-accent/10 transition-colors duration-200"
          >
            Currículo
          </a>

          <button
            className="lg:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          >
            <span
              className={`block w-6 h-0.5 bg-accent transition-all duration-300 origin-center ${
                menuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-accent transition-all duration-300 ${
                menuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-accent transition-all duration-300 origin-center ${
                menuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-background/95 backdrop-blur-md flex flex-col items-center justify-center gap-8">
          {links.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              onClick={closeMenu}
              className="font-mono text-2xl text-text-muted hover:text-accent transition-colors duration-200"
            >
              <span className="text-accent/60 mr-2 text-base">
                {String(i + 1).padStart(2, "0")}.
              </span>
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={closeMenu}
            className="mt-4 font-mono text-sm border border-accent text-accent px-6 py-3 rounded hover:bg-accent/10 transition-colors duration-200"
          >
            Currículo
          </a>
        </div>
      )}
    </>
  );
}
