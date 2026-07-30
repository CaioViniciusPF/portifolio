import type { SiteData } from "@/types";

export const siteDataEn: SiteData = {
  hero: {
    greeting: "Hi, my name is",
    name: "Caio Vinicius",
    roles: [
      "I'm a web developer and computer engineering student at UFC - Federal University of Ceará.",
    ],
    bio: "Front-end developer experienced with React, Next.js and TypeScript. Previously at Altlab/UFC and the GTI Junior Enterprise. Passionate about interfaces and fluid animations.",
    photo: "/images/hero.jpeg",
    scrollLabel: "scroll",
    cta: {
      primary: { label: "See experience", href: "#experience" },
      secondary: { label: "Get in touch", href: "#contact" },
    },
  },

  nav: [
    { label: "About", href: "#about" },
    { label: "Skills", href: "#skills" },
    { label: "Projects", href: "#projects" },
    { label: "Experience", href: "#experience" },
    { label: "Contact", href: "#contact" },
  ],

  resumeLabel: "Resume",

  about: {
    eyebrow: "about me",
    title: "About me",
    paragraphs: [
      "Front-end developer with hands-on experience in React, Next.js, TypeScript and Tailwind CSS, focused on responsive interfaces and REST API integration.",
      "I was a research fellow at UFC's Altlab laboratory, where I built the WiseControl system — integrating front-end and back-end with Next.js, React and MUI. Before that, I worked as Project Director at the GTI Junior Enterprise, leading a team and delivering applications for real clients.",
      "I study GSAP and Three.js to deepen my knowledge of web animation and interactive experiences — this site is the lab for that.",
    ],
    highlights: [
      { label: "Location", value: "Fortaleza, Brazil" },
      { label: "Education", value: "Computer Eng. — UFC" },
      { label: "Experience", value: "~3 years" },
      { label: "Focus", value: "Front-end" },
    ],
  },

  skills: {
    eyebrow: "skills",
    title: "Skills",
    groups: [
      {
        category: "Frontend",
        skills: ["React", "Next.js", "TypeScript", "JavaScript", "HTML5", "CSS3", "Tailwind CSS", "MUI"],
      },
      {
        category: "Tools",
        skills: ["Git", "GitHub", "Figma", "Node.js"],
      },
      {
        category: "Other",
        skills: ["REST APIs", "Responsive Design", "WordPress", "PHP"],
      },
    ],
  },

  projects: {
    eyebrow: "projects",
    title: "Projects",
    viewSiteLabel: "Visit site",
    items: [
      {
        title: "WiseControl",
        description: "Monitoring and control system built for UFC's Altlab laboratory. Interface built with Next.js, React and MUI, integrated with back-end REST APIs.",
        tech: ["Next.js", "React", "MUI", "TypeScript"],
        context: "Altlab — UFC",
      },
      {
        title: "Portfolio",
        description: "This site — personal portfolio and GSAP study playground. Each section explores a different feature of the library.",
        tech: ["Next.js", "GSAP", "TypeScript", "Tailwind CSS"],
        context: "Personal",
        github: "github.com/CaioViniciusPF/portfolio",
      },
    ],
  },

  experience: {
    eyebrow: "experience",
    title: "Experience",
    educationTitle: "Education",
    items: [
      {
        role: "Front-end Developer",
        company: "Altlab — UFC",
        period: "Aug/2025 – May/2026",
        location: "Fortaleza, Brazil · Remote",
        description: [
          "Development of the WiseControl system with Next.js, React and MUI.",
          "Integration with REST APIs to consume and display back-end data.",
          "Building responsive interfaces focused on usability and best practices.",
        ],
        tech: ["Next.js", "React", "MUI", "TypeScript", "Git"],
      },
      {
        role: "Project Director",
        company: "GTI Junior Enterprise",
        period: "Jan/2024 – Aug/2025",
        location: "Fortaleza, Brazil · Hybrid",
        description: [
          "Led the projects department at a web development company focused on front-end.",
          "Built responsive applications and landing pages with React, Next.js and Tailwind.",
          "Managed team, deadlines and processes for real clients.",
        ],
        tech: ["React", "Next.js", "Tailwind CSS", "JavaScript", "Git"],
      },
      {
        role: "Front-end Intern",
        company: "Midiat",
        period: "Jun/2022 – Feb/2023",
        location: "Fortaleza, Brazil · On-site",
        description: [
          "Developed web projects with WordPress, HTML, CSS and JavaScript.",
          "Maintained the internal system built with PHP.",
        ],
        tech: ["WordPress", "HTML", "CSS", "JavaScript", "PHP"],
      },
    ],
  },

  education: [
    {
      degree: "Computer Engineering",
      institution: "Federal University of Ceará (UFC)",
      period: "2023 – 2028 (expected)",
    },
  ],

  contact: {
    eyebrow: "contact",
    title: "Contact",
    ctaHeadline: "Let's talk.",
    description: "Open to opportunities, collaborations and conversations. Feel free to reach out.",
    email: "freirescaiovini@gmail.com",
    emailLabel: "Email",
    github: "github.com/CaioViniciusPF",
    linkedin: "linkedin.com/in/caiovinicius",
    location: "Fortaleza, Brazil",
    locationLabel: "Location",
    form: {
      title: "Send a message",
      fields: {
        name: { label: "Name", placeholder: "Your name" },
        email: { label: "Email", placeholder: "you@company.com" },
        message: {
          label: "Message",
          placeholder: "Tell me about the opportunity or leave a message...",
        },
      },
      submit: "Send message",
      sending: "Sending...",
      success: "Message sent! I'll reply soon.",
      error: "Couldn't send the message. Try again or email me directly.",
    },
  },
};
