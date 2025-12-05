import { useState } from "react";
import type { AwardProps } from "../../types/ResumeProps";
import {
  useCreateAwardMutation,
  useUpdateAwardMutation,
  useDeleteAwardMutation,
  useGetAllAwardsQuery,
} from "../../redux/api/apiResumeSlice";

import { MdOutlineAddCircle, MdOutlineDescription } from "react-icons/md";
import { IoMdCloseCircle } from "react-icons/io";
import { FaMedal } from "react-icons/fa";
// Import icons từ lucide-react
import {
  Award,
  Building,
  Calendar,
  Edit3,
  Trash2,
  Loader2,
  Sparkles,
  Info,
  Star,
  Building2,
  Gem,
} from "lucide-react";
import InputWithIcon from "../UI/InputWithIcon";
import { useDispatch } from "react-redux";
import { addToast } from "../../redux/features/toastSlice";
import { formatDate } from "../../utils/helper";

const AwardManager = () => {
  const {
    data: response,
    isLoading: isFetching,
    error,
    refetch,
  } = useGetAllAwardsQuery();
  const awards = response?.data ?? [];

  const [createAward, { isLoading: isCreating }] = useCreateAwardMutation();
  const [updateAward] = useUpdateAwardMutation();
  const [deleteAward] = useDeleteAwardMutation();
  const [showForm, setShowForm] = useState(false);

  // State quản lý ID đang chỉnh sửa
  const [editingId, setEditingId] = useState<string | null>(null);

  const initialState: AwardProps = {
    id: "",
    name: "",
    organization: "",
    receivedDate: "",
    achievement: "",
    description: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const [form, setForm] = useState<AwardProps>(initialState);

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
      organization: form.organization,
      receivedDate: form.receivedDate,
      achievement: form.achievement,
      description: form.description,
    };

    try {
      if (isEditing) {
        await updateAward({ id: editingId, ...payload }).unwrap();
      } else {
        await createAward(payload).unwrap();
      }

      dispatch(
        addToast({
          type: "success",
          message: "Cập nhật giải thưởng thành công!",
        })
      );

      resetForm();
      refetch();
    } catch (err) {
      dispatch(
        addToast({
          type: "error",
          message: "Cập nhật giải thưởng thất bại!",
        })
      );
    }
  };

  // Bắt đầu chỉnh sửa
  const handleEdit = (award: AwardProps) => {
    setEditingId(award.id as string);
    setForm({ ...award });
    setShowForm(true);
  };

  // Xử lý xóa
  const handleDelete = async (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa giải thưởng này không?")) {
      try {
        await deleteAward(id).unwrap();
        dispatch(
          addToast({
            type: "success",
            message: "Cập nhật giải thưởng thành công!",
          })
        );
        refetch();
      } catch (err) {
        dispatch(
          addToast({
            type: "error",
            message: "Không thể xóa giải thưởng!",
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
          <FaMedal className="mr-3 text-2xl text-blue-600" /> Quản lý Giải
          thưởng
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
          {/* Nhóm 1: Tên giải thưởng & Tổ chức */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="ml-2 block text-sm font-medium text-gray-700 mb-1">
                Tên giải thưởng <span className="text-red-500">*</span>
              </label>
              <InputWithIcon
                Icon={Award}
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="ml-2 block text-sm font-medium text-gray-700 mb-1">
                Tổ chức trao giải <span className="text-red-500">*</span>
              </label>
              <InputWithIcon
                Icon={Building}
                name="organization"
                value={form.organization}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Nhóm 2: Ngày nhận & Thành tích */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <div>
              <label className="ml-2 block text-sm font-medium text-gray-700 mb-1">
                Ngày nhận giải <span className="text-red-500">*</span>
              </label>
              <InputWithIcon
                Icon={Calendar}
                name="receivedDate"
                type="date"
                value={form.receivedDate}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="ml-2 block text-sm font-medium text-gray-700 mb-1">
                Thành tích
              </label>
              <InputWithIcon
                Icon={Sparkles}
                name="achievement"
                value={form.achievement}
                onChange={handleChange}
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
              placeholder="Mô tả thêm về giải thưởng, nội dung thi, ý nghĩa..."
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
            className="mt-4 bg-blue-500 hover:bg-blue-700 transition text-white font-semibold text-sm px-6 py-2.5 rounded-lg shadow disabled:opacity-50 disabled:cursor-wait"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin h-4 w-4 inline mr-2" /> Đang xử
                lý...
              </>
            ) : isEditing ? (
              "Cập nhật Giải thưởng"
            ) : (
              "Lưu Giải thưởng"
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

      {/* 3. Danh sách Giải thưởng */}
      <div className="px-6 py-4">
        {isFetching ? (
          <p className="text-gray-500 italic p-4 text-center">
            Đang tải dữ liệu...
          </p>
        ) : error ? (
          <p className="text-red-500 p-3 bg-red-50 border border-red-200 rounded-lg text-sm">
            ⚠️ Không thể tải danh sách giải thưởng.
          </p>
        ) : awards.length === 0 ? (
          <p className="text-gray-500 italic p-4 text-center border-2 border-dashed border-gray-200 rounded-lg text-sm">
            ✍️ Hãy thêm các giải thưởng và thành tựu của bạn.
          </p>
        ) : (
          <div className="space-y-4">
            {awards.map((award: AwardProps) => (
              <div
                key={award.id}
                className={`relative group border-l-4 p-4 pl-5 shadow-sm bg-gray-50/70 rounded-lg hover:shadow-md transition duration-300 ${
                  award.id === editingId
                    ? "border-red-500 ring-2 ring-red-300 bg-red-50"
                    : "border-blue-500"
                }`}
              >
                {/* Action Buttons: Edit/Delete */}
                <div className="absolute top-3 right-4 flex gap-2 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={() => handleEdit(award)}
                    className="text-gray-500 hover:text-blue-600 transition p-1 rounded hover:bg-white"
                    disabled={isLoading}
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(award.id as string)}
                    className="text-gray-500 hover:text-red-600 transition p-1 rounded hover:bg-white"
                    disabled={isLoading}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Tên giải thưởng và Tổ chức trao giải */}
                <div className="flex justify-between items-start mb-3 border-b pb-2 border-purple-200">
                  <div>
                    <h4 className="text-xl font-extrabold text-purple-800">
                      <Gem size={20} className="inline mr-2 text-purple-600" />
                      {award.name}
                    </h4>
                    <p className="text-base font-semibold text-gray-700 mt-0.5 flex items-center">
                      <Building2 size={16} className="mr-2 text-purple-600" />
                      {award.organization}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  {/* Thành tựu chính */}
                  <div className="text-sm text-gray-700 space-y-2">
                    <p className="flex items-start font-semibold border-l-2 border-purple-400 pl-3 pt-1">
                      <Star
                        size={16}
                        className="mr-2 mt-0.5 text-purple-500 flex-shrink-0"
                      />
                      <span className="font-bold text-gray-800">
                        Thành tựu chính:
                      </span>
                      <span className="ml-1 font-medium">
                        {award.achievement}
                      </span>
                    </p>
                  </div>
                  {/* Ngày nhận giải */}
                  <div className="flex items-center text-sm font-bold px-3 py-1.5 rounded-full bg-purple-100 text-purple-700 shadow-inner">
                    <Calendar size={14} className="mr-1.5" />
                    {formatDate(award.receivedDate)}
                  </div>
                </div>

                {/* Mô tả chi tiết */}
                {award.description && (
                  <div className="pt-3 mt-3 border-t border-purple-100">
                    <p className="font-semibold text-gray-700 mb-1 flex items-center">
                      <Info size={14} className="mr-2 text-gray-500" />
                      Mô tả thêm:
                    </p>
                    {/* Sử dụng whitespace-pre-line để giữ định dạng xuống dòng */}
                    <p className="text-sm text-gray-700 whitespace-pre-line border-l-2 border-purple-300 pl-3 ml-1">
                      {award.description}
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

export default AwardManager;
