export enum UserRole {
  ADMIN = 'ADMIN',
  CANDIDATE = 'CANDIDATE',
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface JobWeights {
  skills: number;
  experience: number;
  education: number;
  tools: number;
}

export interface Job {
  id: string;
  creatorId: string;
  title: string;
  company: string;
  description: string;
  requiredSkills: string[];
  preferredSkills: string[];
  minExperience: number;
  location: string;
  type: 'Full-time' | 'Internship' | 'Remote' | 'Contract';
  weights: JobWeights;
  matchThreshold: number; // minimum % to accept
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
  recommendation: 'ACCEPTED' | 'REJECTED';
  warnings: string[]; // e.g. "Potential keyword stuffing", "Poor PDF formatting"
}

export interface Application {
  id: string;
  jobId: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  resumeFileName: string;
  resumeText: string;
  resumeUrl?: string; // Cloudinary secure URL for the original PDF
  appliedAt: number;
  status: 'ACCEPTED' | 'REJECTED' | 'PENDING';
  aiAnalysis: AIAnalysis | null;
}
