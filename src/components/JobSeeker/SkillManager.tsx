import { useState } from "react";
import type { SkillProps } from "../../types/ResumeProps";
import {
  useCreateSkillMutation,
  useGetAllSkillsQuery,
} from "../../redux/api/apiResumeSlice";
import { MdOutlineAddCircle, MdWork } from "react-icons/md";
import { IoMdCloseCircle } from "react-icons/io";
import { FaThList, FaTools } from "react-icons/fa";
import { FaCode } from "react-icons/fa6";

const SkillManager = () => {
  const {
    data: response,
    isLoading: isFetching,
    error,
    refetch,
  } = useGetAllSkillsQuery();
  const skills = response?.data ?? [];

  const [createSkill, { isLoading: isCreating }] = useCreateSkillMutation();
  const [showForm, setShowForm] = useState(false);

  const initialState: SkillProps = {
    id: "",
    name: "",
    level: "BEGINNER",
    category: "CORE_SKILL",
    description: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const [form, setForm] = useState<SkillProps>(initialState);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createSkill(form).unwrap();
      setForm(initialState);
      refetch();
      setShowForm(false);
    } catch (err) {
      console.error("Lỗi khi tạo kỹ năng:", err);
    }
  };

  return (
    <div className="mt-4">
      {/* Header */}
      <div className="flex justify-between items-center mx-5 mb-4">
        <h1 className="flex items-center text-2xl text-teal-600 font-bold">
          <FaTools className="mr-2" /> Quản lý kỹ năng
        </h1>
        <button
          onClick={() => setShowForm((prev) => !prev)}
          className={`flex items-center transition text-white px-4 py-2 rounded shadow ${
            !showForm
              ? "bg-teal-500 hover:bg-teal-600"
              : "bg-red-500 hover:bg-red-600"
          }`}
        >
          {showForm ? (
            <IoMdCloseCircle className="mr-2" size={22} />
          ) : (
            <MdOutlineAddCircle className="mr-2" size={22} />
          )}
          {showForm ? "Đóng" : "Thêm"}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-gray-50 border border-gray-300 rounded p-5 mx-5 mb-6 shadow-sm"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="name"
              placeholder="Tên kỹ năng (ví dụ: ReactJS, Giao tiếp)"
              value={form.name}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded outline-teal-500"
              required
            />
            <select
              name="level"
              value={form.level}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded outline-teal-500"
              required
            >
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
              <option value="EXPERT">Expert</option>
            </select>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded outline-teal-500"
              required
            >
              <option value="CORE_SKILL">Core Skill</option>
              <option value="SOFT_SKILL">Soft Skill</option>
              <option value="LEADERSHIP_SKILL">Leadership Skill</option>
            </select>
          </div>
          <textarea
            name="description"
            placeholder="Mô tả kỹ năng, cách bạn áp dụng, dự án liên quan..."
            value={form.description}
            onChange={handleChange}
            className="mt-4 border border-gray-300 p-2 rounded w-full outline-teal-500"
            rows={3}
          />
          <button
            type="submit"
            disabled={isCreating}
            className="mt-4 bg-teal-500 hover:bg-teal-600 transition text-white px-6 py-2 rounded shadow"
          >
            {isCreating ? "Đang thêm..." : "Lưu kỹ năng"}
          </button>
        </form>
      )}

      {/* List */}
      <div className="mx-5">
        {isFetching ? (
          <p>Đang tải dữ liệu...</p>
        ) : error ? (
          <p className="text-red-500">Không thể tải danh sách kỹ năng.</p>
        ) : skills.length === 0 ? (
          <p className="text-gray-500 italic">Chưa có kỹ năng nào được thêm.</p>
        ) : (
          <div className="space-y-4">
            {skills.map((skill: SkillProps) => (
              <div
                key={skill.id}
                className="border border-gray-200 rounded p-4 shadow-sm bg-white"
              >
                <h3 className="text-md font-bold text-teal-700">
                  {skill.name}
                </h3>
                <p className="text-sm text-gray-600">
                  Mức độ: {skill.level} | Loại: {skill.category}
                </p>
                {skill.description && (
                  <p className="text-sm text-gray-700 mt-1">
                    {skill.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillManager;
