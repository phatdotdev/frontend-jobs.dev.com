import { useState } from "react";
import type { ExperienceProps } from "../../types/ResumeProps";
import {
  useCreateExperienceMutation,
  useGetAllExperiencesQuery,
} from "../../redux/api/apiResumeSlice";
import { IoMdCloseCircle } from "react-icons/io";
import { MdOutlineAddCircle, MdWork } from "react-icons/md";

const ExperienceManager = () => {
  const {
    data: response,
    isLoading: isFetching,
    error,
    refetch,
  } = useGetAllExperiencesQuery();
  const experiences = response?.data ?? [];

  const [createExperience, { isLoading: isCreating }] =
    useCreateExperienceMutation();

  const initialState: ExperienceProps = {
    id: "",
    companyName: "",
    position: "",
    startDate: "",
    endDate: "",
    description: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const [form, setForm] = useState<ExperienceProps>(initialState);
  const [showForm, setShowForm] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createExperience(form).unwrap();
      setForm(initialState);
      refetch();
      setShowForm(false);
    } catch (err) {
      console.error("Lỗi khi tạo kinh nghiệm:", err);
    }
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
    });

  return (
    <div className="mt-4">
      {/* Header */}
      <div className="flex justify-between items-center mx-5 mb-4">
        <h1 className="flex items-center text-2xl text-teal-600 font-bold">
          <MdWork className="mr-2" /> Kinh nghiệm làm việc
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
              name="companyName"
              placeholder="Tên công ty (ví dụ: FPT Software)"
              value={form.companyName}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded outline-teal-500"
              required
            />
            <input
              name="position"
              placeholder="Vị trí công việc (ví dụ: Frontend Developer)"
              value={form.position}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded outline-teal-500"
              required
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
            placeholder="Mô tả công việc, dự án, thành tựu..."
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
            {isCreating ? "Đang thêm..." : "Lưu kinh nghiệm"}
          </button>
        </form>
      )}

      {/* List */}
      <div className="mx-5">
        {isFetching ? (
          <p>Đang tải dữ liệu...</p>
        ) : error ? (
          <p className="text-red-500">
            Không thể tải danh sách kinh nghiệm làm việc.
          </p>
        ) : experiences.length === 0 ? (
          <p className="text-gray-500 italic">
            Chưa có kinh nghiệm làm việc nào được thêm.
          </p>
        ) : (
          <div className="space-y-4">
            {experiences.map((exp: ExperienceProps) => (
              <div
                key={exp.id}
                className="border border-gray-200 rounded p-4 shadow-sm bg-white"
              >
                <h3 className="text-md font-bold text-teal-700">
                  {exp.companyName} — {exp.position}
                </h3>
                <p className="text-sm text-gray-600">
                  {formatDate(exp.startDate)} → {formatDate(exp.endDate)}
                </p>
                {exp.description && (
                  <p className="text-sm text-gray-700 mt-1">
                    {exp.description}
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

export default ExperienceManager;
