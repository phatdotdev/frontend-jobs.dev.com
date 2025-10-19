import { useState } from "react";
import {
  useCreateEducationMutation,
  useGetAllEducationsQuery,
} from "../../redux/api/apiResumeSlice";
import { FaGraduationCap } from "react-icons/fa6";
import { MdOutlineAddCircle } from "react-icons/md";
import { IoMdCloseCircle } from "react-icons/io";
import type { EducationProps } from "../../types/ResumeProps";
import { FaThList } from "react-icons/fa";

const EducationManager = () => {
  const {
    data: response,
    isLoading: isFetching,
    error,
    refetch,
  } = useGetAllEducationsQuery();
  const educations = response?.data ?? [];

  const [createEducation, { isLoading: isCreating }] =
    useCreateEducationMutation();
  const [showForm, setShowForm] = useState(false);

  const initialState: EducationProps = {
    id: "",
    schoolName: "",
    major: "",
    startDate: "",
    endDate: "",
    degree: "",
    grade: "",
    description: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const [form, setForm] = useState<EducationProps>(initialState);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createEducation(form).unwrap();
      setForm(initialState);
      refetch();
      setShowForm(false);
    } catch (err) {
      console.error("Lỗi khi tạo học vấn:", err);
    }
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
    });

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mx-5 mb-4">
        <h1 className="flex items-center text-2xl text-teal-600 font-bold">
          <FaGraduationCap className="mr-2" /> Quản lý học vấn
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
              name="schoolName"
              placeholder="Trường học (ví dụ: Đại học Cần Thơ)"
              value={form.schoolName}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded outline-teal-500"
              required
            />
            <input
              name="major"
              placeholder="Chuyên ngành (ví dụ: Kỹ thuật phần mềm)"
              value={form.major}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded outline-teal-500"
              required
            />
            <input
              name="degree"
              placeholder="Bằng cấp (ví dụ: Cử nhân, Thạc sĩ)"
              value={form.degree}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded outline-teal-500"
            />
            <input
              name="grade"
              placeholder="Xếp loại / GPA"
              value={form.grade}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded outline-teal-500"
            />
            <input
              name="startDate"
              type="date"
              value={form.startDate}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded outline-teal-500"
              required
            />
            <input
              name="endDate"
              type="date"
              value={form.endDate}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded outline-teal-500"
              required
            />
          </div>
          <textarea
            name="description"
            placeholder="Mô tả thêm (nếu có)"
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
            {isCreating ? "Đang thêm..." : "Lưu học vấn"}
          </button>
        </form>
      )}

      {/* List */}
      <div className="mx-5">
        {isFetching ? (
          <p>Đang tải dữ liệu...</p>
        ) : error ? (
          <p className="text-red-500">Không thể tải danh sách học vấn.</p>
        ) : educations.length === 0 ? (
          <p className="text-gray-500 italic">Chưa có học vấn nào được thêm.</p>
        ) : (
          <div className="space-y-4">
            {educations
              .filter((edu: any) => edu.schoolName)
              .map((edu: any) => (
                <div
                  key={edu.id}
                  className="border border-gray-200 rounded p-4 shadow-sm bg-white"
                >
                  <h3 className="text-md font-bold text-teal-700">
                    {edu.schoolName} — {edu.major}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {formatDate(edu.startDate)} → {formatDate(edu.endDate)}
                  </p>
                  {edu.degree && (
                    <p className="text-sm">
                      🎓 <strong>Bằng cấp:</strong> {edu.degree}
                    </p>
                  )}
                  {edu.grade && (
                    <p className="text-sm">
                      🏅 <strong>Xếp loại:</strong> {edu.grade}
                    </p>
                  )}
                  {edu.description && (
                    <p className="text-sm text-gray-700 mt-1">
                      {edu.description}
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

export default EducationManager;
