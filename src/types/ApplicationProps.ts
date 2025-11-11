export interface ApplicationDetail {
  id: string;
  appliedAt: string;
  state: "SUBMITTED" | "REVIEWING" | "ACCEPTED" | "REJECTED";
  resume: {
    id: string;
    title?: string;
  };
  post: {
    id: string;
    title: string;
    companyName: string;
    avatarUrl: string;
  };
}

export interface PageData<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number; // current page (0-based)
  size: number;
}
