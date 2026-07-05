"use client";

import Navbar from "@/components/ui/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import Experience from "@/components/sections/Experience";
import Contact from "@/components/sections/Contact";
import { useLanguage } from "@/components/ui/LanguageProvider";
import { siteData } from "@/lib/data";
import { siteDataEn } from "@/lib/data.en";

export default function SiteContent() {
  const { locale } = useLanguage();
  const data = locale === "pt" ? siteData : siteDataEn;

  return (
    <main key={locale} className="min-h-screen text-text-main">
      <Navbar links={data.nav} resumeLabel={data.resumeLabel} />
      <Hero data={data.hero} />
      <About data={data.about} />
      <Skills data={data.skills} />
      <Projects data={data.projects} />
      <Experience data={data.experience} education={data.education} />
      <Contact data={data.contact} />
    </main>
  );
}
