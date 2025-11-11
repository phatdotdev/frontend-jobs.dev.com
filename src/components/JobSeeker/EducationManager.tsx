import { useState } from "react";
import {
  useCreateEducationMutation,
  useUpdateEducationMutation,
  useDeleteEducationMutation,
  useGetAllEducationsQuery,
} from "../../redux/api/apiResumeSlice";

import { FaGraduationCap, FaCalendarAlt, FaStar } from "react-icons/fa";
import {
  MdOutlineAddCircle,
  MdSchool,
  MdOutlineDescription,
} from "react-icons/md";
import { IoMdCloseCircle } from "react-icons/io";
import type { EducationProps } from "../../types/ResumeProps";
import { BookOpen, Trophy, Edit3, Trash2, Loader2 } from "lucide-react";
import InputWithIcon from "../UI/InputWithIcon";

const EducationManager = () => {
  const { data: response, refetch } = useGetAllEducationsQuery();
  const educations = response?.data ?? [];

  const [createEducation, { isLoading: isCreating }] =
    useCreateEducationMutation();
  const [updateEducation] = useUpdateEducationMutation();
  const [deleteEducation] = useDeleteEducationMutation();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        schoolName: form.schoolName,
        major: form.major,
        degree: form.degree,
        grade: form.grade,
        startDate: form.startDate,
        endDate: form.endDate,
        description: form.description,
      };

      if (isEditing) {
        await updateEducation({ id: editingId, ...payload }).unwrap();
        console.log("Cập nhật học vấn:", { id: editingId, ...payload });
      } else {
        await createEducation(payload).unwrap();
      }

      resetForm();
      refetch();
    } catch (err) {
      console.error(`Lỗi khi ${isEditing ? "cập nhật" : "tạo"} học vấn:`, err);
    }
  };

  const handleEdit = (education: EducationProps) => {
    setEditingId(education.id);
    const editForm = {
      ...education,
    };
    setForm(editForm);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa mục học vấn này không?")) {
      try {
        await deleteEducation(id).unwrap();
        console.log("Xóa học vấn:", id);
        refetch();
      } catch (err) {
        console.error("Lỗi khi xóa học vấn:", err);
      }
    }
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
    });

  return (
    <div className="p-0 bg-white rounded-xl">
      {/* 1. Header & Nút Thêm/Đóng */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
        <h1 className="flex items-center text-xl font-bold text-gray-800">
          <FaGraduationCap className="mr-3 text-2xl text-teal-600" /> Hồ sơ Học
          vấn
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
          {/* Nhóm 1: Trường học & Chuyên ngành */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <InputWithIcon
              Icon={MdSchool}
              name="schoolName"
              placeholder="Trường học (*)"
              value={form.schoolName}
              onChange={handleChange}
              required
            />
            <InputWithIcon
              Icon={BookOpen}
              name="major"
              placeholder="Chuyên ngành (*)"
              value={form.major}
              onChange={handleChange}
              required
            />
          </div>

          {/* Nhóm 2: Bằng cấp & Xếp loại */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <InputWithIcon
              Icon={Trophy}
              name="degree"
              placeholder="Bằng cấp (ví dụ: Cử nhân)"
              value={form.degree}
              onChange={handleChange}
            />
            <InputWithIcon
              Icon={FaStar}
              name="grade"
              placeholder="Xếp loại / GPA"
              value={form.grade}
              onChange={handleChange}
            />
          </div>

          {/* Nhóm 3: Thời gian */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <InputWithIcon
              Icon={FaCalendarAlt}
              name="startDate"
              type="date"
              value={form.startDate}
              onChange={handleChange}
              required
            />
            <InputWithIcon
              Icon={FaCalendarAlt}
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
              placeholder="Mô tả thêm (Thành tích, luận văn...)"
              value={form.description}
              onChange={handleChange}
              className="border border-gray-300 p-2.5 pl-9 text-sm rounded-lg w-full focus:ring-1 focus:ring-teal-500 focus:border-teal-500 transition duration-150"
              rows={3}
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
              "Cập nhật Học vấn"
            ) : (
              "Lưu Học vấn"
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

      {/* 3. Danh sách Học vấn (Giữ nguyên giao diện đẹp) */}
      <div className="px-6 py-4">
        {educations.length === 0 ? (
          <p className="text-gray-500 italic p-4 text-center border-2 border-dashed border-gray-200 rounded-lg text-sm">
            ✍️ Bắt đầu bằng việc thêm thông tin học vấn của bạn.
          </p>
        ) : (
          <div className="space-y-4">
            {educations.map((edu: any) => (
              <div
                key={edu.id}
                className={`relative group border-l-4 p-4 pl-5 shadow-sm bg-gray-50/70 rounded-lg hover:shadow-md transition duration-300 ${
                  edu.id === editingId
                    ? "border-red-500 ring-2 ring-red-300 bg-red-50"
                    : "border-teal-500"
                }`}
              >
                {/* Action Buttons: Edit/Delete */}
                <div className="absolute top-3 right-4 flex gap-2 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={() => handleEdit(edu)}
                    className="text-gray-500 hover:text-blue-600 transition p-1 rounded hover:bg-white"
                    disabled={isLoading}
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(edu.id)}
                    className="text-gray-500 hover:text-red-600 transition p-1 rounded hover:bg-white"
                    disabled={isLoading}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <h3 className="text-lg font-bold text-teal-700 leading-snug pr-20">
                  {edu.schoolName}
                </h3>
                <p className="text-sm font-semibold text-gray-700">
                  {edu.major}
                </p>

                <div className="mt-2 text-xs font-medium text-gray-500 flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <FaCalendarAlt className="text-teal-500" />
                    {formatDate(edu.startDate)} — {formatDate(edu.endDate)}
                  </span>
                  {edu.degree && (
                    <span className="flex items-center gap-1">
                      <Trophy size={14} className="text-teal-500" />
                      {edu.degree}
                    </span>
                  )}
                  {edu.grade && (
                    <span className="flex items-center gap-1">
                      <FaStar size={14} className="text-teal-500" />
                      {edu.grade}
                    </span>
                  )}
                </div>

                {edu.description && (
                  <p className="text-sm text-gray-600 mt-2 border-t border-gray-200 pt-2">
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
