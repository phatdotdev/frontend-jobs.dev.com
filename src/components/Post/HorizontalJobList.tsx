import JobPosting from "./JobPostingCard";

type JobPostingType = {
  id: string;
  title: string;
  type: string;
  description: string;
  requirements: string;
};

type JobListProps = {
  postings: JobPostingType[];
};

const HorizontalJobList = ({ postings }: JobListProps) => {
  return (
    <div className="overflow-x-auto">
      <div className="flex gap-4 px-4 py-2">
        {postings
          .filter((posting) => posting.title && posting.title.trim() !== "")
          .map((posting) => (
            <div
              key={posting.id}
              className="min-w-[300px] max-w-[350px] flex-shrink-0"
            >
              <JobPosting posting={posting} />
            </div>
          ))}
      </div>
    </div>
  );
};

export default HorizontalJobList;
