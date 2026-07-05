import type { SiteData } from "@/types";

export const siteData: SiteData = {
  hero: {
    greeting: "Olá, me chamo",
    name: "Caio Vinicius",
    roles: [
      "Sou desenvolvedor web e estudante de engenharia da computação na UFC - Universidade Federal do Ceará.",
    ],
    bio: "Desenvolvedor Front-end com experiência em React, Next.js e TypeScript. Atualmente bolsista na Altlab/UFC. Apaixonado por interfaces e animações fluidas.",
    photo: "/images/hero.jpeg",
    scrollLabel: "scroll",
    cta: {
      primary: { label: "Ver experiência", href: "#experience" },
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

  resumeLabel: "Currículo",

  about: {
    eyebrow: "sobre mim",
    title: "Sobre mim",
    paragraphs: [
      "Desenvolvedor Front-end com experiência prática em React, Next.js, TypeScript e Tailwind CSS, com foco em interfaces responsivas e consumo de APIs REST.",
      "Atualmente bolsista no laboratório Altlab da UFC, onde desenvolvo o sistema WiseControl — integrando front-end e back-end com Next.js, React e MUI. Antes disso, atuei como Diretor de Projetos na Empresa Júnior GTI, liderando equipe e entregando aplicações para clientes reais.",
      "Estudo GSAP e Three.js para aprofundar animações web e experiências interativas — este site é o laboratório disso.",
    ],
    highlights: [
      { label: "Localização", value: "Fortaleza, CE" },
      { label: "Formação", value: "Eng. Computação — UFC" },
      { label: "Experiência", value: "~3 anos" },
      { label: "Foco", value: "Front-end" },
    ],
  },

  skills: {
    eyebrow: "habilidades",
    title: "Habilidades",
    groups: [
      {
        category: "Frontend",
        skills: ["React", "Next.js", "TypeScript", "JavaScript", "HTML5", "CSS3", "Tailwind CSS", "MUI"],
      },
      {
        category: "Ferramentas",
        skills: ["Git", "GitHub", "Figma", "Node.js"],
      },
      {
        category: "Outros",
        skills: ["APIs REST", "Design Responsivo", "WordPress", "PHP"],
      },
    ],
  },

  projects: {
    eyebrow: "projetos",
    title: "Projetos",
    viewSiteLabel: "Ver site",
    scrollHint: "( role para o lado )",
    items: [
      {
        title: "WiseControl",
        description: "Sistema de monitoramento e controle desenvolvido para o laboratório Altlab da UFC. Interface com Next.js, React e MUI integrada a APIs REST do back-end.",
        tech: ["Next.js", "React", "MUI", "TypeScript"],
        context: "Altlab — UFC",
        image: "/images/projects/wisecontrol.png",
      },
      {
        title: "Portfólio",
        description: "Este site — portfólio pessoal e playground de estudos com GSAP. Cada seção explora uma feature diferente da biblioteca.",
        tech: ["Next.js", "GSAP", "TypeScript", "Tailwind CSS"],
        context: "Pessoal",
        github: "github.com/CaioViniciusPF/portfolio",
      },
    ],
  },

  experience: {
    eyebrow: "experiência",
    title: "Experiência",
    educationTitle: "Formação",
    items: [
      {
        role: "Desenvolvedor Front-end",
        company: "Altlab — UFC",
        period: "Ago/2025 – Atual",
        location: "Fortaleza, CE · Remoto",
        description: [
          "Desenvolvimento do sistema WiseControl com Next.js, React e MUI.",
          "Integração com APIs REST para consumo e exibição de dados do back-end.",
          "Construção de interfaces responsivas com foco em usabilidade e boas práticas.",
        ],
        tech: ["Next.js", "React", "MUI", "TypeScript", "Git"],
      },
      {
        role: "Diretor de Projetos",
        company: "Empresa Júnior GTI",
        period: "Jan/2024 – Ago/2025",
        location: "Fortaleza, CE · Híbrido",
        description: [
          "Liderança do setor de projetos em empresa de desenvolvimento web com foco em front-end.",
          "Desenvolvimento de aplicações e landing pages responsivas com React, Next.js e Tailwind.",
          "Gestão de equipe, prazos e processos para clientes reais.",
        ],
        tech: ["React", "Next.js", "Tailwind CSS", "JavaScript", "Git"],
      },
      {
        role: "Estagiário Front-end",
        company: "Midiat",
        period: "Jun/2022 – Fev/2023",
        location: "Fortaleza, CE · Presencial",
        description: [
          "Desenvolvimento de projetos web com WordPress, HTML, CSS e JavaScript.",
          "Manutenção do sistema interno com PHP.",
        ],
        tech: ["WordPress", "HTML", "CSS", "JavaScript", "PHP"],
      },
    ],
  },

  education: [
    {
      degree: "Engenharia de Computação",
      institution: "Universidade Federal do Ceará (UFC)",
      period: "2023 – 2028 (previsão)",
    },
  ],

  contact: {
    eyebrow: "contato",
    title: "Contato",
    description: "Aberto a oportunidades, colaborações e conversas. Pode mandar mensagem.",
    email: "freirescaiovini@gmail.com",
    github: "github.com/CaioViniciusPF",
    linkedin: "linkedin.com/in/caiovinicius",
    location: "Fortaleza, CE",
    locationLabel: "Localização",
    form: {
      title: "Envie uma mensagem",
      fields: {
        name: { label: "Nome", placeholder: "Seu nome" },
        email: { label: "Email", placeholder: "voce@empresa.com" },
        message: {
          label: "Mensagem",
          placeholder: "Conte sobre a oportunidade ou deixe sua mensagem...",
        },
      },
      submit: "Enviar mensagem",
      sending: "Enviando...",
      success: "Mensagem enviada! Respondo em breve.",
      error: "Não foi possível enviar. Tente novamente ou use o email direto.",
    },
  },
};
