export enum UserRole {
  ADMIN = 'ADMIN',
  CANDIDATE = 'CANDIDATE',
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  password?: string; // In a real app, this would be hashed/handled by backend
}

export interface JobWeights {
  skills: number;
  experience: number;
  education: number;
  tools: number;
}

export interface Job {
  id: string;
  creatorId: string; // To enforce isolation
  title: string;
  company: string;
  description: string;
  requiredSkills: string[];
  preferredSkills: string[];
  minExperience: number;
  location: string;
  type: 'Full-time' | 'Internship' | 'Remote' | 'Contract';
  weights: JobWeights;
  status: 'DRAFT' | 'PUBLISHED' | 'CLOSED';
  createdAt: number;
}

export interface AIAnalysis {
  overallMatch: number; // 0-100
  summary: string;
  skillAnalysis: {
    matched: string[];
    missing: string[];
    partial: string[];
  };
  experienceMatch: string;
  educationMatch: string;
  gapAnalysis: string[];
  evidence: string[];
}

export interface Application {
  id: string;
  jobId: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  resumeFileName: string;
  appliedAt: number;
  aiAnalysis: AIAnalysis | null;
}
