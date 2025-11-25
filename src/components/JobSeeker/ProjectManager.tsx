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
import {
  Code,
  Edit3,
  Trash2,
  Loader2,
  User,
  Zap,
  Link,
  Info,
  TrendingUp,
  UserCheck,
  Layers,
} from "lucide-react";
import InputWithIcon from "../UI/InputWithIcon";
import { formatDate, formatDateTime } from "../../utils/helper";
import { useDispatch } from "react-redux";
import { addToast } from "../../redux/features/toastSlice";

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
    projectUrl: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const [form, setForm] = useState<ProjectProps>(initialState);

  const isEditing = !!editingId;
  const isLoading = isCreating;

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

  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name: form.name,
      role: form.role,
      result: form.result,
      description: form.description,
      projectUrl: form.projectUrl,
    };

    try {
      if (isEditing) {
        await updateProject({ id: editingId, ...payload }).unwrap();
      } else {
        await createProject(payload as any).unwrap();
      }

      dispatch(
        addToast({
          type: "success",
          message: "Cập nhật dự án thành công!",
        })
      );

      resetForm();
      refetch();
    } catch (err) {
      dispatch(
        addToast({
          type: "error",
          message: "Đã có lỗi xảy ra!",
        })
      );
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
        await deleteProject(id).unwrap();
        dispatch(
          addToast({
            type: "success",
            message: "Cập nhật dự án thành công!",
          })
        );
        refetch();
      } catch (err) {
        dispatch(
          addToast({
            type: "error",
            message: "Không thể xóa dự án!",
          })
        );
      }
    }
  };

  return (
    <div className="p-0 bg-white rounded-xl shadow-lg mt-6">
      {/* 1. Header & Nút Thêm/Đóng (Màu blue) */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
        <h1 className="flex items-center text-xl font-bold text-gray-800">
          <FaLaptopCode className="mr-3 text-2xl text-blue-600" /> Quản lý Dự án
        </h1>
        <button
          onClick={() => (showForm ? resetForm() : setShowForm(true))}
          className={`flex items-center text-sm font-semibold transition py-1.5 px-3 rounded-md border ${
            showForm
              ? "bg-white text-gray-600 hover:bg-red-50 hover:text-red-600 border-gray-300"
              : "bg-blue-500 text-white hover:bg-blue-700 border-blue-600 shadow-md"
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

      {/* 2. Form Thêm/Chỉnh sửa (Màu nền blue) */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-blue-50/50 p-6 shadow-inner transition-all duration-300 ease-in-out"
        >
          {/* Nhóm 1: Tên dự án & Vai trò */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="ml-2 block text-sm font-medium text-gray-700 mb-1">
                Tên dự án <span className="text-red-500">*</span>
              </label>
              <InputWithIcon
                Icon={Code}
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="ml-2 block text-sm font-medium text-gray-700 mb-1">
                Vai trò <span className="text-red-500">*</span>
              </label>
              <InputWithIcon
                Icon={User}
                name="role"
                value={form.role}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Nhóm 2: Kết quả & Link dự án */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <div>
              <label className="ml-2 block text-sm font-medium text-gray-700 mb-1">
                Kết quả / Thành tựu
              </label>
              <InputWithIcon
                Icon={Zap}
                name="result"
                value={form.result}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="ml-2 block text-sm font-medium text-gray-700 mb-1">
                Link dự án / GitHub
              </label>
              <InputWithIcon
                Icon={Link}
                name="projectUrl"
                value={form.projectUrl ?? ""}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Mô tả */}
          <div className="relative mb-3">
            <label className="ml-2 block text-sm font-medium text-gray-700 mb-1">
              Mô tả dự án
            </label>
            <MdOutlineDescription className="absolute left-3 top-9 w-4 h-4 text-gray-400" />
            <textarea
              name="description"
              placeholder="Mô tả dự án, công nghệ sử dụng, quy mô, đóng góp cá nhân..."
              value={form.description}
              onChange={handleChange}
              className="border border-gray-300 p-2.5 pl-9 text-sm rounded-lg w-full focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
              rows={4}
            />
          </div>

          {/* Nút Submit/Update */}
          <button
            type="submit"
            disabled={isLoading}
            className="mt-4 bg-blue-500 hover:bg-blue-700 transition text-white font-semibold text-sm px-6 py-2.5 rounded-lg shadow disabled:opacity-50 disabled:cursor-wait"
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
                  // Viền blue
                  project.id === editingId
                    ? "border-red-500 ring-2 ring-red-300 bg-red-50"
                    : "border-blue-500"
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
                    onClick={() => handleDelete(project.id as string)}
                    className="text-gray-500 hover:text-red-600 transition p-1 rounded hover:bg-white"
                    disabled={isLoading}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Tiêu đề chính */}
                <div className="flex justify-between items-start mb-3 border-b pb-2 border-orange-200">
                  <h4 className="text-xl font-extrabold text-orange-700">
                    <Layers size={20} className="inline mr-2 text-orange-600" />
                    {project.name}
                  </h4>
                </div>

                {/* Thông tin Vai trò và Kết quả */}
                <div className="text-sm text-gray-700 space-y-2">
                  {/* Vai trò */}
                  <p className="flex items-center font-semibold">
                    <UserCheck size={14} className="mr-2 text-orange-500" />
                    Vai trò:{" "}
                    <span className="ml-1 font-medium">{project.role}</span>
                  </p>

                  {/* Kết quả */}
                  <p className="flex items-center font-semibold">
                    <TrendingUp size={14} className="mr-2 text-orange-500" />
                    Kết quả đạt được:{" "}
                    <span className="ml-1 font-medium text-teal-700">
                      {project.result}
                    </span>
                  </p>
                </div>

                {/* Mô tả chi tiết */}
                {project.description && (
                  <div className="pt-3 mt-3 border-t border-orange-100">
                    <p className="font-semibold text-gray-700 mb-1 flex items-center">
                      <Info size={14} className="mr-2 text-gray-500" />
                      Mô tả dự án:
                    </p>
                    {/* Sử dụng whitespace-pre-line để giữ định dạng xuống dòng */}
                    <p className="text-sm text-gray-700 whitespace-pre-line border-l-2 border-orange-300 pl-3 ml-1">
                      {project.description}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectManager;
