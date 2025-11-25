import { useState } from "react";
import type { SkillProps } from "../../types/ResumeProps";
import {
  useCreateSkillMutation,
  // Giả định thêm các mutations cho Update và Delete
  useUpdateSkillMutation,
  useDeleteSkillMutation,
  useGetAllSkillsQuery,
} from "../../redux/api/apiResumeSlice";

import { MdOutlineAddCircle, MdOutlineDescription } from "react-icons/md";
import { IoMdCloseCircle } from "react-icons/io";
import { FaTools } from "react-icons/fa";
import {
  Code,
  TrendingUp,
  Edit3,
  Trash2,
  Loader2,
  List,
  Zap,
  Sun,
  Star,
  TrendingUpDown,
  Award,
  User,
  Info,
} from "lucide-react";
import InputWithIcon from "../UI/InputWithIcon";
import SelectWithIcon from "../UI/SelectWithIcon";
import { useDispatch } from "react-redux";
import { addToast } from "../../redux/features/toastSlice";

const SKILL_LEVELS: { [key: string]: string } = {
  BEGINNER: "Sơ cấp",
  INTERMEDIATE: "Trung cấp",
  ADVANCED: "Nâng cao",
  EXPERT: "Chuyên gia",
};

const SKILL_CATEGORIES: { [key: string]: string } = {
  CORE_SKILL: "Kỹ năng chuyên môn",
  SOFT_SKILL: "Kỹ năng mềm",
  LEADERSHIP_SKILL: "Kỹ năng lãnh đạo",
};

const SkillManager = () => {
  const {
    data: response,
    isLoading: isFetching,
    error,
    refetch,
  } = useGetAllSkillsQuery();
  const skills = response?.data ?? [];

  const [createSkill, { isLoading: isCreating }] = useCreateSkillMutation();

  const [deleteSkill] = useDeleteSkillMutation();
  const [updateSkill] = useUpdateSkillMutation();

  const [showForm, setShowForm] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);

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

  const isEditing = !!editingId;
  const isLoading = isCreating;

  const dispatch = useDispatch();

  const getLevelDisplay = (level: SkillProps["level"]) => {
    switch (level) {
      case "EXPERT":
        return {
          color: "bg-red-500",
          text: "text-red-900",
          label: "Chuyên gia",
          icon: Award,
        };
      case "ADVANCED":
        return {
          color: "bg-green-500",
          text: "text-green-900",
          label: "Nâng cao",
          icon: TrendingUpDown,
        };
      case "INTERMEDIATE":
        return {
          color: "bg-yellow-500",
          text: "text-yellow-900",
          label: "Trung cấp",
          icon: Star,
        };
      case "BEGINNER":
      default:
        return {
          color: "bg-gray-400",
          text: "text-gray-900",
          label: "Cơ bản",
          icon: Sun,
        };
    }
  };

  const getCategoryDisplay = (category: SkillProps["category"]) => {
    switch (category) {
      case "CORE_SKILL":
        return { icon: Code, label: "Chuyên môn" };
      case "LEADERSHIP_SKILL":
        return { icon: Zap, label: "Lãnh đạo" };
      case "SOFT_SKILL":
      default:
        return { icon: User, label: "Kỹ năng mềm" };
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
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

    const payload = {
      name: form.name,
      level: form.level,
      category: form.category,
      description: form.description,
    };

    try {
      if (isEditing) {
        await updateSkill({ id: editingId, ...payload }).unwrap();
      } else {
        await createSkill(payload).unwrap();
      }
      dispatch(
        addToast({
          type: "success",
          message: "Cập nhật kỹ năng thành công!",
        })
      );
      resetForm();
      refetch();
    } catch (err) {
      dispatch(
        addToast({
          type: "error",
          message: "Đã có lỗi xảy ra khi cập nhật!",
        })
      );
    }
  };

  // Bắt đầu chỉnh sửa
  const handleEdit = (skill: SkillProps) => {
    setEditingId(skill.id as string);
    setForm({ ...skill });
    setShowForm(true);
  };

  // Xử lý xóa
  const handleDelete = async (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa kỹ năng này không?")) {
      try {
        dispatch(
          addToast({
            type: "success",
            message: "Cập nhật kỹ năng thành công!",
          })
        );
        await deleteSkill(id).unwrap();
        refetch();
      } catch (err) {
        dispatch(
          addToast({
            type: "error",
            message: "Không thể xóa kỹ năng!",
          })
        );
      }
    }
  };

  return (
    <div className="p-0 bg-white rounded-xl shadow-lg">
      {/* 1. Header & Nút Thêm/Đóng (Màu blue) */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
        <h1 className="flex items-center text-xl font-bold text-gray-800">
          <FaTools className="mr-3 text-2xl text-blue-600" /> Quản lý Kỹ năng
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            {/* Tên kỹ năng */}
            <InputWithIcon
              Icon={Code}
              name="name"
              placeholder="Tên kỹ năng (ví dụ: ReactJS, Giao tiếp)"
              value={form.name}
              onChange={handleChange}
              required
            />

            {/* Mức độ */}
            <SelectWithIcon
              Icon={TrendingUp}
              name="level"
              value={form.level}
              onChange={handleChange}
              options={Object.keys(SKILL_LEVELS).map((key) => ({
                value: key,
                label: SKILL_LEVELS[key],
              }))}
            />

            {/* Phân loại */}
            <SelectWithIcon
              Icon={List}
              name="category"
              value={form.category}
              onChange={handleChange}
              options={Object.keys(SKILL_CATEGORIES).map((key) => ({
                value: key,
                label: SKILL_CATEGORIES[key],
              }))}
            />
          </div>

          {/* Mô tả */}
          <div className="relative">
            <MdOutlineDescription className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <textarea
              name="description"
              placeholder="Mô tả kỹ năng, cách bạn áp dụng, dự án liên quan..."
              value={form.description}
              onChange={handleChange}
              // Focus màu blue
              className="border border-gray-300 p-2.5 pl-9 text-sm rounded-lg w-full focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
              rows={3}
            />
          </div>

          {/* Nút Submit/Update (Màu blue) */}
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
              "Cập nhật Kỹ năng"
            ) : (
              "Lưu Kỹ năng"
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

      {/* 3. Danh sách Kỹ năng */}
      <div className="px-6 py-4">
        {isFetching ? (
          <p className="text-gray-500 italic p-4 text-center">
            Đang tải dữ liệu...
          </p>
        ) : error ? (
          <p className="text-red-500 p-3 bg-red-50 border border-red-200 rounded-lg text-sm">
            ⚠️ Không thể tải danh sách kỹ năng.
          </p>
        ) : skills.length === 0 ? (
          <p className="text-gray-500 italic p-4 text-center border-2 border-dashed border-gray-200 rounded-lg text-sm">
            ✍️ Hãy thêm kỹ năng của bạn.
          </p>
        ) : (
          <div className="space-y-4">
            {skills.map((skill: SkillProps) => {
              const levelDisplay = getLevelDisplay(skill.level);
              const LevelIcon = levelDisplay.icon;

              const categoryDisplay = getCategoryDisplay(skill.category);
              const CategoryIcon = categoryDisplay.icon;
              return (
                <div
                  key={skill.id}
                  className={`relative group border-l-4 p-4 pl-5 shadow-sm bg-gray-50/70 rounded-lg hover:shadow-md transition duration-300 ${
                    // Viền blue
                    skill.id === editingId
                      ? "border-red-500 ring-2 ring-red-300 bg-red-50"
                      : "border-blue-500"
                  }`}
                >
                  {/* Action Buttons: Edit/Delete */}
                  <div className="absolute top-3 right-4 flex gap-2 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={() => handleEdit(skill)}
                      className="text-gray-500 hover:text-blue-600 transition p-1 rounded hover:bg-white"
                      disabled={isLoading}
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(skill.id as string)}
                      className="text-gray-500 hover:text-red-600 transition p-1 rounded hover:bg-white"
                      disabled={isLoading}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {/* Tên kỹ năng và Cấp độ */}
                  <div className="flex justify-between items-start mb-3 border-b pb-2 border-gray-100">
                    <h4 className="text-xl font-extrabold text-gray-800">
                      {skill.name}
                    </h4>
                  </div>

                  <div className="flex items-center justify-between">
                    {/* Thông tin Danh mục */}
                    <p className="text-sm text-gray-600 mb-3 flex items-center">
                      <CategoryIcon size={14} className="mr-2 text-teal-600" />
                      **Danh mục:** {categoryDisplay.label}
                    </p>

                    {/* Cấp độ kỹ năng (Level Badge) */}
                    <div
                      className={`flex items-center text-xs font-bold px-3 py-1.5 rounded-full ${levelDisplay.color} ${levelDisplay.text} bg-opacity-20 shadow-inner`}
                      title={`Cấp độ: ${levelDisplay.label}`}
                    >
                      <LevelIcon size={14} className="mr-1.5" />
                      {levelDisplay.label}
                    </div>
                  </div>

                  {/* Mô tả chi tiết */}
                  {skill.description && (
                    <div className="pt-2 border-t border-gray-100">
                      <p className="font-semibold text-gray-700 mb-1 flex items-center">
                        <Info size={14} className="mr-2 text-gray-500" />
                        Mô tả:
                      </p>
                      {/* Sử dụng whitespace-pre-line để giữ định dạng xuống dòng */}
                      <p className="text-sm text-gray-700 whitespace-pre-line border-l-2 border-gray-300 pl-3 ml-1">
                        {skill.description}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillManager;
