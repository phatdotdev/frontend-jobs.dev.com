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
import {
  BookOpen,
  Trophy,
  Edit3,
  Trash2,
  Loader2,
  Calendar,
  GraduationCap,
} from "lucide-react";
import InputWithIcon from "../UI/InputWithIcon";
import { useDispatch } from "react-redux";
import { addToast } from "../../redux/features/toastSlice";
import { formatDate } from "../../utils/helper";

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

  const dispatch = useDispatch();

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
        dispatch(
          addToast({
            type: "success",
            message: "Cập nhật học vấn thành công",
          })
        );
      } else {
        await createEducation(payload).unwrap();
        dispatch(
          addToast({
            type: "success",
            message: "Cập nhật học vấn thành công",
          })
        );
      }

      resetForm();
      refetch();
    } catch (err) {
      dispatch(
        addToast({
          type: "error",
          message: "Có lỗi xảy ra khi tạo học vấn",
        })
      );
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
        dispatch(
          addToast({
            type: "success",
            message: "Cập nhật học vấn thành công",
          })
        );
        refetch();
      } catch (err) {
        dispatch(
          addToast({
            type: "error",
            message: "Không thể xóa học vấn",
          })
        );
      }
    }
  };

  return (
    <div className="p-0 bg-white rounded-xl">
      {/* 1. Header & Nút Thêm/Đóng */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
        <h1 className="flex items-center text-xl font-bold text-gray-800">
          <FaGraduationCap className="mr-3 text-2xl text-blue-600" /> Hồ sơ Học
          vấn
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

      {/* 2. Form Thêm/Chỉnh sửa */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-blue-50/50 p-6 shadow-inner transition-all duration-300 ease-in-out"
        >
          {/* Nhóm 1: Trường học & Chuyên ngành */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="ml-2 block text-sm font-medium text-gray-700 mb-1">
                Trường học <span className="text-red-500">*</span>
              </label>
              <InputWithIcon
                Icon={MdSchool}
                name="schoolName"
                value={form.schoolName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="ml-2 block text-sm font-medium text-gray-700 mb-1">
                Chuyên ngành <span className="text-red-500">*</span>
              </label>
              <InputWithIcon
                Icon={BookOpen}
                name="major"
                value={form.major}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Nhóm 2: Bằng cấp & Xếp loại */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="ml-2 block text-sm font-medium text-gray-700 mb-1">
                Bằng cấp
              </label>
              <InputWithIcon
                Icon={Trophy}
                name="degree"
                value={form.degree}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="ml-2 block text-sm font-medium text-gray-700 mb-1">
                Xếp loại / GPA
              </label>
              <InputWithIcon
                Icon={FaStar}
                name="grade"
                value={form.grade}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Nhóm 3: Thời gian */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <div>
              <label className="ml-2 block text-sm font-medium text-gray-700 mb-1">
                Ngày bắt đầu <span className="text-red-500">*</span>
              </label>
              <InputWithIcon
                Icon={FaCalendarAlt}
                name="startDate"
                type="date"
                value={form.startDate}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="ml-2 block text-sm font-medium text-gray-700 mb-1">
                Ngày kết thúc <span className="text-red-500">*</span>
              </label>
              <InputWithIcon
                Icon={FaCalendarAlt}
                name="endDate"
                type="date"
                value={form.endDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Mô tả */}
          <div className="relative mb-3">
            <label className="ml-2 block text-sm font-medium text-gray-700 mb-1">
              Mô tả thêm
            </label>
            <MdOutlineDescription className="absolute left-3 top-9 w-4 h-4 text-gray-400" />
            <textarea
              name="description"
              placeholder="Thành tích, luận văn..."
              value={form.description}
              onChange={handleChange}
              className="border border-gray-300 p-2.5 pl-9 text-sm rounded-lg w-full focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
              rows={3}
            />
          </div>

          {/* Nút Submit/Update */}
          <button
            type="submit"
            disabled={isLoading}
            className="mt-4 bg-blue-600 hover:bg-blue-700 transition text-white font-semibold text-sm px-6 py-2.5 rounded-lg shadow disabled:opacity-50 disabled:cursor-wait"
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
                    : "border-blue-500"
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

                {/* Tiêu đề chính */}
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="text-xl font-extrabold text-blue-800">
                      {edu.schoolName}
                    </h4>
                    <p className="text-base font-semibold text-teal-600 mt-0.5">
                      <GraduationCap size={16} className="inline mr-2" />
                      {edu.degree} - {edu.major}
                    </p>
                  </div>
                </div>

                <hr className="my-3 border-blue-200" />

                {/* Thông tin thời gian và chi tiết */}
                <div className="text-sm text-gray-600 space-y-2">
                  <div className="flex justify-between">
                    {/* Thời gian */}
                    <p className="flex items-center font-medium">
                      <Calendar size={14} className="mr-2 text-blue-500" />
                      Thời gian:{" "}
                      <span className="mx-1 font-semibold">
                        {formatDate(edu.startDate)}{" "}
                      </span>{" "}
                      đến{" "}
                      <span className="ml-1 font-semibold">
                        {formatDate(edu.endDate)}
                      </span>
                    </p>

                    {/* Điểm số/Thành tích (Grade) */}
                    {edu.grade && (
                      <div className="flex items-center text-sm font-bold px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 shadow-inner">
                        <Trophy size={14} className="mr-1.5" />
                        {edu.grade}
                      </div>
                    )}
                  </div>

                  {/* Mô tả/Ghi chú */}
                  {edu.description && (
                    <div className="pt-2 border-t border-blue-100">
                      <p className="flex items-center font-semibold text-gray-700 mb-1">
                        <BookOpen size={14} className="mr-2 text-blue-500" />
                        Mô tả chi tiết:
                      </p>
                      {/* Sử dụng whitespace-pre-line để giữ định dạng xuống dòng */}
                      <p className="text-sm text-gray-700 whitespace-pre-line border-l-2 border-blue-300 pl-3 ml-1">
                        {edu.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EducationManager;
