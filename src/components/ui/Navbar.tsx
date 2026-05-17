"use client";

import { useRef, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import type { NavLink } from "@/types";

function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="w-8 h-8" />;

  const isDark = theme === "dark";

  const handleClick = () => {
    const btn = btnRef.current;
    if (!btn) return;

    const rect = btn.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    document.documentElement.style.setProperty("--vt-x", `${x}px`);
    document.documentElement.style.setProperty("--vt-y", `${y}px`);

    const targetTheme = isDark ? "light" : "dark";

    if (!document.startViewTransition) {
      setTheme(targetTheme);
      return;
    }

    document.startViewTransition(() => setTheme(targetTheme));
  };

  return (
    <button
      ref={btnRef}
      onClick={handleClick}
      aria-label={isDark ? "Ativar modo claro" : "Ativar modo escuro"}
      className="w-8 h-8 flex items-center justify-center text-text-muted hover:text-accent transition-colors duration-200"
    >
      {isDark ? (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 7a5 5 0 000 10A5 5 0 0012 7z" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )}
    </button>
  );
}

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
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useGSAP(
    () => {
      if (hasAnimated) {
        gsap.set(navRef.current, { y: 0, opacity: 1 });
      }
    },
    { scope: navRef, dependencies: [] }
  );

  useEffect(() => {
    if (hasAnimated) return;
    const onReady = () => {
      hasAnimated = true;
      gsap.to(navRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power3.out",
      });
    };
    window.addEventListener("hero:ready", onReady);
    return () => window.removeEventListener("hero:ready", onReady);
  }, []);

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
            &lt;CaioVini /&gt;
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

          <ThemeToggle />

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
