import type { ResumeProps } from "./ResumeProps";
import type { ExpertProps } from "./UserProps";

export interface FeedbackRequestProps {
  id: string;
  resume: ResumeProps;
  status: string;
  notes: string;
  createdAt: string;
  completedAt: string;
  reviews: FeedbackReviewProps[];
}

export interface FeedbackReviewProps {
  expertId: any;
  reviewerName: string;
  id: string;
  score: number;
  overallComment: string;
  experienceComment: string;
  skillsComment: string;
  educationComment: string;
  recommendation: string;
  createdAt: string;
  resume?: ResumeProps;
  expert?: ExpertProps;
}
