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
  id: string;
  companyName: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
};

export type SkillProps = {
  id: string;
  name: string;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";
  category: "SOFT_SKILL" | "CORE_SKILL" | "LEADERSHIP_SKILL";
  description: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CertificationProps = {
  id: string;
  name: string;
  organization: string;
  issueDate: string;
  expirationDate?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ProjectProps = {
  id: string;
  name: string;
  role: string;
  result: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
};

export type AwardProps = {
  id: string;
  name: string;
  organization: string;
  receivedDate: string;
  achievement: string;
  description: string;
  createAt: Date;
  updateAt: Date;
};

export type ActivityProps = {
  id: string;
  name: string;
  organization: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
};
