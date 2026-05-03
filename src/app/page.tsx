import Navbar from "@/components/ui/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Experience from "@/components/sections/Experience";
import Contact from "@/components/sections/Contact";
import { siteData } from "@/lib/data";

export default function Home() {
  return (
    <main className="bg-background min-h-screen text-text-main">
      <Navbar links={siteData.nav} />
      <Hero data={siteData.hero} />
      <About data={siteData.about} />
      <Skills data={siteData.skills} />
      <Experience data={siteData.experience} education={siteData.education} />
      <Contact data={siteData.contact} />
    </main>
  );
}
