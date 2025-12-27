export interface Experience {
  title: string;
  company: string;
  period: string;
  description: string[];
}

export interface Education {
  degree: string;
  institution: string;
  period: string;
  gpa?: string;
}

export interface Project {
  title: string;
  description: string;
  technologies: string[];
  url?: string;
  image?: string;
}

export interface Skill {
  category: string;
  items: string[];
}

export interface Certificate {
  name: string;
  issuer: string;
  year: string;
  image?: string;
}

export interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  github: string;
  linkedin: string;
  summary: string;
}
