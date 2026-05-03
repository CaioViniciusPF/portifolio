export interface HeroData {
  greeting: string;
  name: string;
  roles: string[];
  bio: string;
  cta: {
    primary: { label: string; href: string };
    secondary: { label: string; href: string };
  };
}

export interface NavLink {
  label: string;
  href: string;
}

export interface AboutData {
  paragraphs: string[];
  highlights: { label: string; value: string }[];
}

export interface SkillGroup {
  category: string;
  skills: string[];
}

export interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  location: string;
  description: string[];
  tech: string[];
}

export interface EducationItem {
  degree: string;
  institution: string;
  period: string;
}

export interface ContactData {
  email: string;
  github: string;
  linkedin: string;
  location: string;
}

export interface SiteData {
  hero: HeroData;
  nav: NavLink[];
  about: AboutData;
  skills: SkillGroup[];
  experience: ExperienceItem[];
  education: EducationItem[];
  contact: ContactData;
}
