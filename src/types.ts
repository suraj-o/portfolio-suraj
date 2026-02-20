// ─── Shared type definitions for the frontend ───

export interface PersonalInfo {
    name: string;
    location: string;
    phone: string;
    email: string;
    linkedin: string;
    github: string;
}

export interface Skills {
    Languages: string[];
    Backend: string[];
    Frontend: string[];
    DevOps: string[];
}

export interface ExperienceEntry {
    company: string;
    role: string;
    period: string;
    location: string;
    highlights: string[];
}

export interface ProjectEntry {
    name: string;
    tech: string[];
    highlights: string[];
}

export interface Education {
    degree: string;
    institution: string;
    location: string;
    period: string;
}

export interface PortfolioData {
    personal: PersonalInfo;
    summary: string;
    skills: Skills;
    experience: ExperienceEntry[];
    projects: ProjectEntry[];
    education: Education;
    certifications: string[];
}

// ─── API types ───

export interface AIResponse {
    message: string;
    equivalentCmd: string;
    openUrl?: string;
}

// ─── Terminal state types ───

export type InputMode = "cli" | "ai";

export interface LineEntry {
    id: number;
    cmd: string;
    mode: InputMode;
    output: React.ReactNode | null;
}
