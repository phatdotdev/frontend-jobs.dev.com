import React, { useState } from "react";
import { useCreateJobPostingMutation } from "../../redux/api/postApiSlice";
import { useNavigate } from "react-router-dom";

const CreateJobPostForm = () => {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("FULL_TIME");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [benefits, setBenefits] = useState("");
  const [promotedSalary, setPromotedSalary] = useState<number | "">("");
  const [expiredAt, setExpiredAt] = useState("");

  const [createJobPosting, isLoading] = useCreateJobPostingMutation();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title,
      type,
      description,
      requirements,
      benefits,
      promotedSalary: promotedSalary === "" ? null : Number(promotedSalary),
      expiredAt,
      state: "DRAFT",
    };
    await createJobPosting(payload);
    navigate("/recruiter/post");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow space-y-4"
    >
      <h2 className="text-xl font-bold text-teal-700">📝 Tạo bài tuyển dụng</h2>

      <div>
        <label className="block font-medium text-gray-700">Tiêu đề</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder="VD: Kỹ sư AI nhận diện bệnh cây trồng"
          required
        />
      </div>

      <div>
        <label className="block font-medium text-gray-700">
          Loại công việc
        </label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          <option value="FULL_TIME">Toàn thời gian</option>
          <option value="PART_TIME">Bán thời gian</option>
          <option value="INTERNSHIP">Thực tập</option>
        </select>
      </div>

      {/* Mô tả công việc */}

      <div>
        <label className="block font-medium text-gray-700">
          Mô tả công việc
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border rounded px-3 py-2"
          rows={4}
          placeholder="Chi tiết công việc, nhiệm vụ..."
          required
        />
      </div>

      <div>
        <label className="block font-medium text-gray-700">Yêu cầu</label>
        <textarea
          value={requirements}
          onChange={(e) => setRequirements(e.target.value)}
          className="w-full border rounded px-3 py-2"
          rows={3}
          placeholder="Kinh nghiệm, kỹ năng, bằng cấp..."
          required
        />
      </div>

      <div>
        <label className="block font-medium text-gray-700">Quyền lợi</label>
        <textarea
          value={benefits}
          onChange={(e) => setBenefits(e.target.value)}
          className="w-full border rounded px-3 py-2"
          rows={3}
          placeholder="Lương thưởng, làm việc từ xa, phúc lợi..."
        />
      </div>

      <div>
        <label className="block font-medium text-gray-700">
          Mức lương đề xuất (VND)
        </label>
        <input
          type="number"
          value={promotedSalary}
          onChange={(e) =>
            setPromotedSalary(
              e.target.value === "" ? "" : Number(e.target.value)
            )
          }
          className="w-full border rounded px-3 py-2"
          placeholder="VD: 20000000"
        />
      </div>

      <div>
        <label className="block font-medium text-gray-700">Hạn nộp</label>
        <input
          type="datetime-local"
          value={expiredAt}
          onChange={(e) => setExpiredAt(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      <button
        type="submit"
        className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition"
      >
        Tạo bài tuyển dụng
      </button>
    </form>
  );
};

export default CreateJobPostForm;
