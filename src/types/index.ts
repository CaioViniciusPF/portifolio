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

export interface SiteData {
  hero: HeroData;
  nav: NavLink[];
}
