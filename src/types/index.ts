export interface HeroData {
  greeting: string;
  name: string;
  roles: string[];
  bio?: string;
  photo?: string;
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
  eyebrow: string;
  title: string;
  paragraphs: string[];
  highlights: { label: string; value: string }[];
}

export interface SkillGroup {
  category: string;
  skills: string[];
}

export interface SkillsData {
  eyebrow: string;
  title: string;
  groups: SkillGroup[];
}

export interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  location: string;
  description: string[];
  tech: string[];
}

export interface ExperienceData {
  eyebrow: string;
  title: string;
  educationTitle: string;
  items: ExperienceItem[];
}

export interface EducationItem {
  degree: string;
  institution: string;
  period: string;
}

export interface ContactFormField {
  label: string;
  placeholder: string;
}

export interface ContactFormContent {
  title: string;
  fields: {
    name: ContactFormField;
    email: ContactFormField;
    message: ContactFormField;
  };
  submit: string;
  sending: string;
  success: string;
  error: string;
}

export interface ContactData {
  eyebrow: string;
  title: string;
  description: string;
  email: string;
  github: string;
  linkedin: string;
  location: string;
  locationLabel: string;
  form: ContactFormContent;
}

export interface ProjectItem {
  title: string;
  description: string;
  tech: string[];
  context: string;
  image?: string;
  link?: string;
  github?: string;
}

export interface ProjectsData {
  eyebrow: string;
  title: string;
  viewSiteLabel: string;
  items: ProjectItem[];
}

export type Locale = "pt" | "en";

export interface SiteData {
  hero: HeroData;
  nav: NavLink[];
  resumeLabel: string;
  about: AboutData;
  skills: SkillsData;
  projects: ProjectsData;
  experience: ExperienceData;
  education: EducationItem[];
  contact: ContactData;
}
