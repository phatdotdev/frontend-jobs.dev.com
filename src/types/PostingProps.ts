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
  views: number;
  likes: number;

  createdAt: Date;
  updateAt: Date;
  expiredAt: Date;
};
