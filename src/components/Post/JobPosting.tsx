type JobPostingProps = {
  id: string;
  title: string;
  type: string;
  description: string;
  requirements: string;
  promotedSalary?: number;
  expiredAt?: string;
};

const SingleJobPosting = ({ posting }: { posting: JobPostingProps }) => {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md space-y-4">
      <h1 className="text-2xl font-bold text-teal-700">
        {posting.title || "Chưa cập nhật"}
      </h1>

      <div className="text-sm text-gray-600">
        <span className="font-medium">Loại công việc:</span> {posting.type}
      </div>

      {posting.promotedSalary && (
        <div className="text-sm text-gray-600">
          <span className="font-medium">Mức lương đề xuất:</span> $
          {posting.promotedSalary}
        </div>
      )}

      {posting.expiredAt && (
        <div className="text-sm text-gray-600">
          <span className="font-medium">Hạn nộp:</span>{" "}
          {new Date(posting.expiredAt).toLocaleDateString("vi-VN")}
        </div>
      )}

      {/* <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-1">
          📋 Mô tả công việc
        </h2>
        <p className="text-gray-700 whitespace-pre-line">
          {posting.description}
        </p>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-1">🧠 Yêu cầu</h2>
        <p className="text-gray-700 whitespace-pre-line">
          {posting.requirements}
        </p>
      </div> */}
    </div>
  );
};

export default SingleJobPosting;
