export type ApplicationState =
  | "SUBMITTED"
  | "REVIEWING"
  | "REQUESTED"
  | "ACCEPTED"
  | "REJECTED"
  | "HIRED"
  | "INTERVIEW"
  | "";

export interface DocumentProps {
  id: string;
  fileName: string;
  fileType: string;
  originalName: string;
  size: number;
  uploadedAt: string;
}

export interface NotificationProps {
  id: string;
  title: string;
  content: string;
  timestamp: string;
}

export interface ApplicationDetail {
  acceptedAt: string | number | Date;
  hiredAt: string | number | Date;
  rejectedAt: any;
  updatedAt: string;
  id: string;
  appliedAt: string;
  state:
    | "SUBMITTED"
    | "REVIEWING"
    | "REQUESTED"
    | "ACCEPTED"
    | "REJECTED"
    | "HIRED";
  resume: {
    avatarUrl: string;
    id: string;
    title?: string;
    objectCareer: string;
    email: string;
    firstname: string;
    lastname: string;
    phone: string;
  };
  post: {
    id: string;
    title: string;
    companyName: string;
    avatarUrl: string;
  };
  notifications: any[];
  documents: any[];
}

export interface PageData<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}
