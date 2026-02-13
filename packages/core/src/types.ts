export interface ProjectLink {
  label: string;
  url: string;
}

export interface SkillGroup {
  group: string;
  items: string[];
}

export interface Project {
  title: string;
  stack: string;
  bullets: string[];
  links?: ProjectLink[];
}

export interface Experience {
  role: string;
  company: string;
  date: string;
  bullets: string[];
}

export interface Education {
  title: string;
  subtitle: string;
  date: string;
}

export interface Language {
  name: string;
  level: string;
  note: string;
}

export interface ResumeData {
  name: string;
  title: string;
  email: string;
  phone_e164: string;
  phone_display: string;
  location: string;
  linkedin_url: string;
  github_url: string;
  website_url: string;
  summary: string;
  skills: SkillGroup[];
  projects: Project[];
  experience: Experience[];
  education: Education[];
  languages: Language[];
}
