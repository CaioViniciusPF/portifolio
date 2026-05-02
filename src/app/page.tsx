import Navbar from "@/components/ui/Navbar";
import Hero from "@/components/sections/Hero";
import { siteData } from "@/lib/data";

export default function Home() {
  return (
    <main className="bg-background min-h-screen text-text-main">
      <Navbar links={siteData.nav} />
      <Hero data={siteData.hero} />

      <section
        id="about"
        className="min-h-screen flex items-center justify-center border-t border-border"
      >
        <div className="text-center">
          <p className="font-mono text-accent/50 text-sm mb-2">em breve</p>
          <h2 className="text-3xl font-bold text-text-muted">Sobre mim</h2>
          <p className="text-text-muted/60 mt-2 font-mono text-sm">
            GSAP: ScrollTrigger
          </p>
        </div>
      </section>

      <section
        id="skills"
        className="min-h-screen flex items-center justify-center border-t border-border"
      >
        <div className="text-center">
          <p className="font-mono text-accent/50 text-sm mb-2">em breve</p>
          <h2 className="text-3xl font-bold text-text-muted">Habilidades</h2>
          <p className="text-text-muted/60 mt-2 font-mono text-sm">
            GSAP: stagger
          </p>
        </div>
      </section>

      <section
        id="projects"
        className="min-h-screen flex items-center justify-center border-t border-border"
      >
        <div className="text-center">
          <p className="font-mono text-accent/50 text-sm mb-2">em breve</p>
          <h2 className="text-3xl font-bold text-text-muted">Projetos</h2>
          <p className="text-text-muted/60 mt-2 font-mono text-sm">
            GSAP: ScrollTrigger + scrub
          </p>
        </div>
      </section>

      <section
        id="experience"
        className="min-h-screen flex items-center justify-center border-t border-border"
      >
        <div className="text-center">
          <p className="font-mono text-accent/50 text-sm mb-2">em breve</p>
          <h2 className="text-3xl font-bold text-text-muted">Experiência</h2>
          <p className="text-text-muted/60 mt-2 font-mono text-sm">
            GSAP: gsap.timeline()
          </p>
        </div>
      </section>

      <section
        id="contact"
        className="min-h-screen flex items-center justify-center border-t border-border"
      >
        <div className="text-center">
          <p className="font-mono text-accent/50 text-sm mb-2">em breve</p>
          <h2 className="text-3xl font-bold text-text-muted">Contato</h2>
          <p className="text-text-muted/60 mt-2 font-mono text-sm">
            GSAP: ease personalizado
          </p>
        </div>
      </section>
    </main>
  );
}
