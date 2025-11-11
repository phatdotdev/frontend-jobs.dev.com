export type PostingProps = {
  id: string;
  title: string;
  type:
    | ""
    | "FULL_TIME"
    | "PART_TIME"
    | "INTERNSHIP"
    | "FREELANCE"
    | "CONTRACT"
    | "TEMPORARY"
    | "REMOTE";
  description: string;
  requirements: string;
  benefits: string;
  state: "DRAFT" | "PUBLISHED" | "EXPIRED" | "ACHIVED";
  views?: number;
  likes?: number;
  applies?: number;

  avatarUrl: string;
  companyName: string;
  minSalary: number;
  maxSalary: number;
  experience: string;

  createdAt: string;
  updateAt: string;
  expiredAt: string;
  imageNames: string[];

  location: { id: string; name: string };
};

export type JobType =
  | "FULL_TIME"
  | "PART_TIME"
  | "INTERNSHIP"
  | "FREELANCE"
  | "CONTRACT"
  | "TEMPORARY"
  | "REMOTE";

export type Location = {
  id: string;
  name: string;
};
