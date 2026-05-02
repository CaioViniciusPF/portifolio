import type { SiteData } from "@/types";

export const siteData: SiteData = {
  hero: {
    greeting: "Olá, eu sou",
    name: "Caio Vinicius",
    roles: [
      "Desenvolvedor Frontend",
      "Entusiasta de UI/UX",
      "Aprendiz de GSAP",
    ],
    bio: "Apaixonado por criar interfaces modernas e animações fluidas. Este site é ao mesmo tempo meu portfólio e meu laboratório de estudos com GSAP.",
    cta: {
      primary: { label: "Ver projetos", href: "#projects" },
      secondary: { label: "Fale comigo", href: "#contact" },
    },
  },
  nav: [
    { label: "Sobre", href: "#about" },
    { label: "Habilidades", href: "#skills" },
    { label: "Projetos", href: "#projects" },
    { label: "Experiência", href: "#experience" },
    { label: "Contato", href: "#contact" },
  ],
};
