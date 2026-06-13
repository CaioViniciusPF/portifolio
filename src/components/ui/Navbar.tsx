"use client";

import { useRef, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import type { NavLink } from "@/types";
import { useLanguage } from "./LanguageProvider";

function LanguageToggle() {
  const { locale, toggleLocale } = useLanguage();
  const isPt = locale === "pt";

  return (
    <button
      onClick={toggleLocale}
      aria-label={isPt ? "Switch to English" : "Mudar para português"}
      className="w-9 h-9 flex items-center justify-center rounded-full border border-border hover:border-accent text-text-muted hover:text-accent font-mono text-xs font-semibold tracking-wider transition-colors duration-200"
    >
      {isPt ? "PT" : "EN"}
    </button>
  );
}

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
      className="w-9 h-9 flex items-center justify-center rounded-full border border-border hover:border-accent text-text-muted hover:text-accent transition-colors duration-200"
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

function CurriculoButton({ label, className, onClick }: { label: string; className?: string; onClick?: () => void }) {
  const btnRef = useRef<HTMLAnchorElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const iconRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      gsap.set(fillRef.current, { scaleX: 0, transformOrigin: "left center" });

      const enter = () => {
        const bg = getComputedStyle(document.documentElement)
          .getPropertyValue("--color-background")
          .trim();
        gsap.killTweensOf([fillRef.current, labelRef.current, iconRef.current]);
        gsap.set(fillRef.current, { transformOrigin: "left center" });
        gsap.to(fillRef.current, { scaleX: 1, duration: 0.35, ease: "power3.out" });
        gsap.to([labelRef.current, iconRef.current], { color: bg, duration: 0.2, ease: "none" });
        gsap.to(iconRef.current, { x: 3, y: -3, duration: 0.35, ease: "power2.out" });
      };

      const leave = () => {
        gsap.killTweensOf([fillRef.current, labelRef.current, iconRef.current]);
        gsap.set([labelRef.current, iconRef.current], { clearProps: "color" });
        gsap.set(fillRef.current, { transformOrigin: "right center" });
        gsap.to(fillRef.current, { scaleX: 0, duration: 0.3, ease: "power3.in" });
        gsap.to(iconRef.current, { x: 0, y: 0, duration: 0.3, ease: "power2.out" });
      };

      const el = btnRef.current;
      el?.addEventListener("mouseenter", enter);
      el?.addEventListener("mouseleave", leave);
      return () => {
        el?.removeEventListener("mouseenter", enter);
        el?.removeEventListener("mouseleave", leave);
      };
    },
    { scope: btnRef }
  );

  return (
    <a
      ref={btnRef}
      href="/Caio_Vinicius_Curriculo.pdf"
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      className={`relative inline-flex items-center gap-2 font-mono text-sm border border-accent rounded overflow-hidden ${className ?? ""}`}
    >
      <span ref={fillRef} className="absolute inset-0 bg-accent" />
      <span ref={labelRef} className="relative z-10 text-accent">{label}</span>
      <span ref={iconRef} className="relative z-10 text-accent">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </span>
    </a>
  );
}

let hasAnimated = false;

interface NavbarProps {
  links: NavLink[];
  resumeLabel: string;
}

export default function Navbar({ links, resumeLabel }: NavbarProps) {
  const navRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(
    () => typeof window !== "undefined" && window.scrollY > 40
  );
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

          <CurriculoButton label={resumeLabel} className="hidden lg:inline-flex px-4 py-2" />

          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
          </div>

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
          <CurriculoButton label={resumeLabel} className="mt-4 px-6 py-3" onClick={closeMenu} />
        </div>
      )}
    </>
  );
}
