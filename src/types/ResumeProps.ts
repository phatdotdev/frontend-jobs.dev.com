export type EducationProps = {
  id: string;
  schoolName: string;
  degree: string;
  major: string;
  grade: string;
  description: string;
  startDate: string;
  endDate: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ExperienceProps = {
  id?: string;
  companyName: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type SkillProps = {
  id?: string;
  name: string;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";
  category: "SOFT_SKILL" | "CORE_SKILL" | "LEADERSHIP_SKILL";
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type CertificationProps = {
  id?: string;
  name: string;
  issuer: string;
  issueDate: string;
  expirationDate?: string;
  description?: string;
  credentialId?: string;
  credentialUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type ProjectProps = {
  id?: string;
  name: string;
  role: string;
  result: string;
  description: string;
  projectUrl: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type AwardProps = {
  id?: string;
  name: string;
  organization: string;
  receivedDate: string;
  achievement: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type ActivityProps = {
  id?: string;
  name: string;
  organization: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export interface ResumeFormProps {
  id?: string;
  title: string;
  introduction: string;
  objectCareer: string;
  educations: string[];
  experiences: string[];
  certifications: string[];
  skills: string[];
  projects: string[];
  awards: string[];
  activities: string[];
}

export interface ResumeProps {
  avatarUrl: string;
  id?: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  address: string;
  gender: string;
  dob: string;
  title: string;
  introduction: string;
  objectCareer: string;
  educations: EducationProps[];
  experiences: EducationProps[];
  certifications: CertificationProps[];
  skills: SkillProps[];
  projects: ProjectProps[];
  awards: ActivityProps[];
  activities: ActivityProps[];
  createdAt: string;
  updatedAt: string;
}
