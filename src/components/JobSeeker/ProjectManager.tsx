import { useState } from "react";
import type { ProjectProps } from "../../types/ResumeProps";
import {
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useGetAllProjectsQuery,
} from "../../redux/api/apiResumeSlice";

import { MdOutlineAddCircle, MdOutlineDescription } from "react-icons/md";
import { IoMdCloseCircle } from "react-icons/io";
import { FaLaptopCode } from "react-icons/fa6";
// Import icons từ lucide-react cho gọn gàng và hiện đại
import { Code, Edit3, Trash2, Loader2, User, Zap, Link } from "lucide-react";
import InputWithIcon from "../UI/InputWithIcon";

const ProjectManager = () => {
  const {
    data: response,
    isLoading: isFetching,
    error,
    refetch,
  } = useGetAllProjectsQuery();
  const projects = response?.data ?? [];

  const [createProject, { isLoading: isCreating }] = useCreateProjectMutation();
  const [updateProject] = useUpdateProjectMutation();
  const [deleteProject] = useDeleteProjectMutation();
  const [showForm, setShowForm] = useState(false);

  // State quản lý ID đang chỉnh sửa
  const [editingId, setEditingId] = useState<string | null>(null);

  const initialState: ProjectProps = {
    id: "",
    name: "",
    role: "",
    result: "",
    description: "",
    // Thêm trường URL (giả định) để tiện quản lý dự án
    projectUrl: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const [form, setForm] = useState<ProjectProps>(initialState);

  const isEditing = !!editingId;
  const isLoading = isCreating; // Cần thêm || isUpdating || isDeleting khi có API

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm(initialState);
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Tạo payload chỉ chứa các field cần thiết
    const payload = {
      name: form.name,
      role: form.role,
      result: form.result,
      description: form.description,
    };

    console.log(payload);

    try {
      if (isEditing) {
        await updateProject({ id: editingId, ...payload }).unwrap();
      } else {
        await createProject(payload).unwrap();
      }

      resetForm();
      refetch();
    } catch (err) {
      console.error(`Lỗi khi ${isEditing ? "cập nhật" : "tạo"} dự án:`, err);
    }
  };

  // Bắt đầu chỉnh sửa
  const handleEdit = (project: ProjectProps) => {
    setEditingId(project.id as string);
    setForm({ ...project });
    setShowForm(true);
  };

  // Xử lý xóa
  const handleDelete = async (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa dự án này không?")) {
      try {
        console.log("Xóa dự án:", id);
        await deleteProject(id).unwrap();
        refetch();
      } catch (err) {
        console.error("Lỗi khi xóa dự án:", err);
      }
    }
  };

  const formatDate = (date: Date) =>
    new Date(date).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
    });

  return (
    <div className="p-0 bg-white rounded-xl shadow-lg mt-6">
      {/* 1. Header & Nút Thêm/Đóng (Màu Teal) */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
        <h1 className="flex items-center text-xl font-bold text-gray-800">
          <FaLaptopCode className="mr-3 text-2xl text-teal-600" /> Quản lý Dự án
        </h1>
        <button
          onClick={() => (showForm ? resetForm() : setShowForm(true))}
          className={`flex items-center text-sm font-semibold transition py-1.5 px-3 rounded-md border ${
            showForm
              ? "bg-white text-gray-600 hover:bg-red-50 hover:text-red-600 border-gray-300"
              : "bg-teal-600 text-white hover:bg-teal-700 border-teal-600 shadow-md"
          }`}
        >
          {showForm ? (
            <IoMdCloseCircle className="mr-1" size={20} />
          ) : (
            <MdOutlineAddCircle className="mr-1" size={20} />
          )}
          {showForm ? "Đóng Form" : "Thêm mới"}
        </button>
      </div>

      {/* 2. Form Thêm/Chỉnh sửa (Màu nền Teal) */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-teal-50/50 p-6 shadow-inner transition-all duration-300 ease-in-out"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            {/* Tên dự án */}
            <InputWithIcon
              Icon={Code}
              name="name"
              placeholder="Tên dự án (*)"
              value={form.name}
              onChange={handleChange}
              required
            />
            {/* Vai trò */}
            <InputWithIcon
              Icon={User}
              name="role"
              placeholder="Vai trò (*)"
              value={form.role}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            {/* Kết quả/Thành tựu */}
            <InputWithIcon
              Icon={Zap}
              name="result"
              placeholder="Kết quả/Thành tựu (Tùy chọn)"
              value={form.result}
              onChange={handleChange}
            />
            {/* URL Dự án (Giả định thêm) */}
            <InputWithIcon
              Icon={Link}
              name="projectUrl"
              placeholder="Link dự án/GitHub (Tùy chọn)"
              value={form.projectUrl}
              onChange={handleChange}
            />
          </div>

          {/* Mô tả */}
          <div className="relative">
            <MdOutlineDescription className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <textarea
              name="description"
              placeholder="Mô tả dự án, công nghệ sử dụng, quy mô, đóng góp cá nhân..."
              value={form.description}
              onChange={handleChange}
              // Focus màu Teal
              className="border border-gray-300 p-2.5 pl-9 text-sm rounded-lg w-full focus:ring-1 focus:ring-teal-500 focus:border-teal-500 transition duration-150"
              rows={4}
            />
          </div>

          {/* Nút Submit/Update (Màu Teal) */}
          <button
            type="submit"
            disabled={isLoading}
            className="mt-4 bg-teal-600 hover:bg-teal-700 transition text-white font-semibold text-sm px-6 py-2.5 rounded-lg shadow disabled:opacity-50 disabled:cursor-wait"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin h-4 w-4 inline mr-2" /> Đang xử
                lý...
              </>
            ) : isEditing ? (
              "Cập nhật Dự án"
            ) : (
              "Lưu Dự án"
            )}
          </button>

          {/* Nút Hủy Chỉnh sửa */}
          {isEditing && (
            <button
              type="button"
              onClick={resetForm}
              className="ml-3 mt-4 text-gray-600 hover:text-red-600 font-medium text-sm transition"
            >
              Hủy
            </button>
          )}
        </form>
      )}

      {/* 3. Danh sách Dự án */}
      <div className="px-6 py-4">
        {isFetching ? (
          <p className="text-gray-500 italic p-4 text-center">
            Đang tải dữ liệu...
          </p>
        ) : error ? (
          <p className="text-red-500 p-3 bg-red-50 border border-red-200 rounded-lg text-sm">
            ⚠️ Không thể tải danh sách dự án.
          </p>
        ) : projects.length === 0 ? (
          <p className="text-gray-500 italic p-4 text-center border-2 border-dashed border-gray-200 rounded-lg text-sm">
            ✍️ Hãy thêm các dự án quan trọng của bạn.
          </p>
        ) : (
          <div className="space-y-4">
            {projects.map((project: ProjectProps) => (
              <div
                key={project.id}
                className={`relative group border-l-4 p-4 pl-5 shadow-sm bg-gray-50/70 rounded-lg hover:shadow-md transition duration-300 ${
                  // Viền Teal
                  project.id === editingId
                    ? "border-red-500 ring-2 ring-red-300 bg-red-50"
                    : "border-teal-500"
                }`}
              >
                {/* Action Buttons: Edit/Delete */}
                <div className="absolute top-3 right-4 flex gap-2 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={() => handleEdit(project)}
                    className="text-gray-500 hover:text-blue-600 transition p-1 rounded hover:bg-white"
                    disabled={isLoading}
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="text-gray-500 hover:text-red-600 transition p-1 rounded hover:bg-white"
                    disabled={isLoading}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <h3 className="text-lg font-bold text-teal-700 leading-snug pr-20">
                  {project.name}
                </h3>

                <p className="text-sm font-semibold text-gray-700 mt-1">
                  Vai trò: **{project.role}**
                </p>

                {project.result && (
                  <p className="text-sm text-gray-600">
                    Thành tựu: *{project.result}*
                  </p>
                )}

                {project.description && (
                  <p className="text-sm text-gray-600 mt-2 border-t border-gray-200 pt-2 whitespace-pre-line">
                    {project.description}
                  </p>
                )}

                {project.projectUrl && (
                  <a
                    href={project.projectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-teal-500 hover:text-teal-700 flex items-center mt-2 font-medium"
                  >
                    <Link className="inline w-3 h-3 mr-1" /> Xem dự án
                  </a>
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
