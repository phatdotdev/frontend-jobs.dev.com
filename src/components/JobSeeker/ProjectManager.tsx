import { useState } from "react";
import type { ProjectProps } from "../../types/ResumeProps";
import {
  useCreateProjectMutation,
  useGetAllProjectsQuery,
} from "../../redux/api/apiResumeSlice";
import { MdOutlineAddCircle } from "react-icons/md";
import { IoMdCloseCircle } from "react-icons/io";
import { FaThList } from "react-icons/fa";
import { FaLaptopCode } from "react-icons/fa6";

const ProjectManager = () => {
  const {
    data: response,
    isLoading: isFetching,
    error,
    refetch,
  } = useGetAllProjectsQuery();
  const projects = response?.data ?? [];

  const [createProject, { isLoading: isCreating }] = useCreateProjectMutation();
  const [showForm, setShowForm] = useState(false);

  const initialState: ProjectProps = {
    id: "",
    name: "",
    role: "",
    result: "",
    description: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const [form, setForm] = useState<ProjectProps>(initialState);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createProject(form).unwrap();
      setForm(initialState);
      refetch();
      setShowForm(false);
    } catch (err) {
      console.error("Lỗi khi tạo dự án:", err);
    }
  };

  const formatDate = (date: Date) =>
    new Date(date).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
    });

  return (
    <div className="mt-4">
      {/* Header */}
      <div className="flex justify-between items-center mx-5 mb-4">
        <h1 className="flex items-center text-2xl text-teal-600 font-bold">
          <FaLaptopCode className="mr-2" /> Dự án đã tham gia
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
              placeholder="Tên dự án (ví dụ: Hệ thống quản lý sinh viên)"
              value={form.name}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded outline-teal-500"
              required
            />
            <input
              name="role"
              placeholder="Vai trò (ví dụ: Backend Developer)"
              value={form.role}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded outline-teal-500"
              required
            />
            <input
              name="result"
              placeholder="Kết quả (ví dụ: Triển khai thành công, đạt giải)"
              value={form.result}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded outline-teal-500"
            />
          </div>
          <textarea
            name="description"
            placeholder="Mô tả dự án, công nghệ sử dụng, quy mô..."
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
            {isCreating ? "Đang thêm..." : "Lưu dự án"}
          </button>
        </form>
      )}

      {/* List */}
      <div className="mx-5">
        {isFetching ? (
          <p>Đang tải dữ liệu...</p>
        ) : error ? (
          <p className="text-red-500">Không thể tải danh sách dự án.</p>
        ) : projects.length === 0 ? (
          <p className="text-gray-500 italic">Chưa có dự án nào được thêm.</p>
        ) : (
          <div className="space-y-4">
            {projects.map((project: ProjectProps) => (
              <div
                key={project.id}
                className="border border-gray-200 rounded p-4 shadow-sm bg-white"
              >
                <h3 className="text-md font-bold text-teal-700">
                  {project.name}
                </h3>
                <p className="text-sm text-gray-600">Vai trò: {project.role}</p>
                {project.result && (
                  <p className="text-sm text-gray-600">
                    Kết quả: {project.result}
                  </p>
                )}
                {project.description && (
                  <p className="text-sm text-gray-700 mt-1">
                    {project.description}
                  </p>
                )}
                <p className="text-xs text-gray-400 italic mt-1">
                  Tạo lúc: {formatDate(project.createdAt)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectManager;
