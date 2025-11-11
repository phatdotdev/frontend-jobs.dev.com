import { useState } from "react";
import type { ExperienceProps } from "../../types/ResumeProps";
import {
  useCreateExperienceMutation,
  // Giả định thêm các mutations cho Update và Delete
  useUpdateExperienceMutation,
  useDeleteExperienceMutation,
  useGetAllExperiencesQuery,
} from "../../redux/api/apiResumeSlice";

import { IoMdCloseCircle } from "react-icons/io";
import {
  MdOutlineAddCircle,
  MdOutlineDescription,
  MdWork,
} from "react-icons/md";
// Import các icons cần thiết
import {
  Briefcase,
  Building,
  Calendar,
  Edit3,
  Trash2,
  Loader2,
} from "lucide-react";
import InputWithIcon from "../UI/InputWithIcon";

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
  const [updateExperience] = useUpdateExperienceMutation();
  const [deleteExperience] = useDeleteExperienceMutation();

  const [editingId, setEditingId] = useState<string | null>(null);

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
    try {
      const payload = {
        companyName: form.companyName,
        position: form.position,
        startDate: form.startDate,
        endDate: form.endDate,
        description: form.description,
      };
      if (isEditing) {
        // Logic cập nhật (nếu có API update)
        await updateExperience({ id: editingId, ...payload }).unwrap();
      } else {
        // Tạo payload không có id, createdAt, updatedAt

        await createExperience(payload).unwrap();
      }

      resetForm();
      refetch();
    } catch (err) {
      console.error(
        `Lỗi khi ${isEditing ? "cập nhật" : "tạo"} kinh nghiệm:`,
        err
      );
    }
  };

  const handleEdit = (experience: ExperienceProps) => {
    setEditingId(experience?.id as string);
    setForm({ ...experience });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (
      window.confirm("Bạn có chắc chắn muốn xóa mục kinh nghiệm này không?")
    ) {
      try {
        console.log("Xóa kinh nghiệm:", id);
        await deleteExperience(id).unwrap();
        refetch();
      } catch (err) {
        console.error("Lỗi khi xóa kinh nghiệm:", err);
      }
    }
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
    });

  return (
    <div className="p-0 bg-white rounded-xl shadow-lg">
      {/* 1. Header & Nút Thêm/Đóng */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
        <h1 className="flex items-center text-xl font-bold text-gray-800">
          <MdWork className="mr-3 text-2xl text-teal-600" /> Quản lý Kinh nghiệm
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

      {/* 2. Form Thêm/Chỉnh sửa */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-teal-50/50 p-6 shadow-inner transition-all duration-300 ease-in-out"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <InputWithIcon
              Icon={Building}
              name="companyName"
              placeholder="Tên công ty (*)"
              value={form.companyName}
              onChange={handleChange}
              required
            />
            <InputWithIcon
              Icon={Briefcase}
              name="position"
              placeholder="Vị trí công việc (*)"
              value={form.position}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <InputWithIcon
              Icon={Calendar}
              name="startDate"
              type="date"
              value={form.startDate}
              onChange={handleChange}
              required
            />
            <InputWithIcon
              Icon={Calendar}
              name="endDate"
              type="date"
              value={form.endDate}
              onChange={handleChange}
              required
            />
          </div>

          {/* Mô tả - Sử dụng Textarea tùy chỉnh */}
          <div className="relative">
            <MdOutlineDescription className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <textarea
              name="description"
              placeholder="Mô tả công việc, dự án, thành tựu..."
              value={form.description}
              onChange={handleChange}
              className="border border-gray-300 p-2.5 pl-9 text-sm rounded-lg w-full focus:ring-1 focus:ring-teal-500 focus:border-teal-500 transition duration-150"
              rows={4}
            />
          </div>

          {/* Nút Submit/Update */}
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
              "Cập nhật Kinh nghiệm"
            ) : (
              "Lưu Kinh nghiệm"
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

      {/* 3. Danh sách Kinh nghiệm */}
      <div className="px-6 py-4">
        {isFetching ? (
          <p className="text-gray-500 italic p-4 text-center">
            Đang tải dữ liệu...
          </p>
        ) : error ? (
          <p className="text-red-500 p-3 bg-red-50 border border-red-200 rounded-lg text-sm">
            ⚠️ Không thể tải danh sách kinh nghiệm làm việc.
          </p>
        ) : experiences.length === 0 ? (
          <p className="text-gray-500 italic p-4 text-center border-2 border-dashed border-gray-200 rounded-lg text-sm">
            ✍️ Hãy thêm kinh nghiệm làm việc đầu tiên của bạn.
          </p>
        ) : (
          <div className="space-y-4">
            {experiences.map((exp: ExperienceProps) => (
              <div
                key={exp.id}
                className={`relative group border-l-4 p-4 pl-5 shadow-sm bg-gray-50/70 rounded-lg hover:shadow-md transition duration-300 ${
                  exp.id === editingId
                    ? "border-red-500 ring-2 ring-red-300 bg-red-50"
                    : "border-teal-500"
                }`}
              >
                {/* Action Buttons: Edit/Delete */}
                <div className="absolute top-3 right-4 flex gap-2 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={() => handleEdit(exp)}
                    className="text-gray-500 hover:text-blue-600 transition p-1 rounded hover:bg-white"
                    disabled={isLoading}
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(exp.id as string)}
                    className="text-gray-500 hover:text-red-600 transition p-1 rounded hover:bg-white"
                    disabled={isLoading}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <h3 className="text-lg font-bold text-teal-700 leading-snug pr-20">
                  {exp.companyName}
                </h3>
                <p className="text-sm font-semibold text-gray-700">
                  {exp.position}
                </p>
                <p className="mt-1 text-xs font-medium text-gray-500 flex items-center gap-1">
                  <Calendar className="text-teal-500" size={14} />
                  {formatDate(exp.startDate)} — {formatDate(exp.endDate)}
                </p>
                {exp.description && (
                  <p className="text-sm text-gray-600 mt-2 border-t border-gray-200 pt-2 whitespace-pre-line">
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
