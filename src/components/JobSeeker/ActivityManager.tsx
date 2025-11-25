import { useState } from "react";
import type { ActivityProps } from "../../types/ResumeProps";
import {
  useCreateActivityMutation,
  useUpdateActivityMutation,
  useDeleteActivityMutation,
  useGetAllActivitiesQuery,
} from "../../redux/api/apiResumeSlice";

import { MdOutlineAddCircle, MdOutlineDescription } from "react-icons/md";
import { IoMdCloseCircle } from "react-icons/io";
import { MdGroups } from "react-icons/md";
// Import icons từ lucide-react
import {
  Users,
  Building,
  Calendar,
  Edit3,
  Trash2,
  Loader2,
  User,
  Clock,
  MapPin,
  UserCheck,
  Info,
} from "lucide-react";
import InputWithIcon from "../UI/InputWithIcon";
import { useDispatch } from "react-redux";
import { addToast } from "../../redux/features/toastSlice";
import { formatDate } from "../../utils/helper";

const ActivityManager = () => {
  const {
    data: response,
    isLoading: isFetching,
    error,
    refetch,
  } = useGetAllActivitiesQuery();
  const activities = response?.data ?? [];

  const [createActivity, { isLoading: isCreating }] =
    useCreateActivityMutation();
  const [updateActivity] = useUpdateActivityMutation();
  const [deleteActivity] = useDeleteActivityMutation();
  const [showForm, setShowForm] = useState(false);

  // State quản lý ID đang chỉnh sửa
  const [editingId, setEditingId] = useState<string | null>(null);

  const initialState: ActivityProps = {
    id: "",
    name: "",
    organization: "",
    role: "",
    startDate: "",
    endDate: "",
    description: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const [form, setForm] = useState<ActivityProps>(initialState);

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
      role: form.role,
      startDate: form.startDate,
      endDate: form.endDate,
      description: form.description,
    };
    try {
      if (isEditing) {
        await updateActivity({ id: editingId, ...payload }).unwrap();
      } else {
        await createActivity(payload).unwrap();
      }
      dispatch(
        addToast({
          type: "success",
          message: "Cập nhật hoạt động thành công!",
        })
      );

      resetForm();
      refetch();
    } catch (err) {
      dispatch(
        addToast({
          type: "error",
          message: "Lỗi khi cập nhật hoạt động!",
        })
      );
    }
  };

  // Bắt đầu chỉnh sửa
  const handleEdit = (activity: ActivityProps) => {
    setEditingId(activity.id as string);
    setForm({ ...activity });
    setShowForm(true);
  };

  // Xử lý xóa
  const handleDelete = async (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa hoạt động này không?")) {
      try {
        await deleteActivity(id).unwrap();
        dispatch(
          addToast({
            type: "success",
            message: "Cập nhật hoạt động thành công!",
          })
        );
        refetch();
      } catch (err) {
        dispatch(
          addToast({
            type: "error",
            message: "Không thể xóa hoạt động!",
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
          <MdGroups className="mr-3 text-2xl text-blue-600" /> Quản lý Hoạt động
          Ngoại khóa
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
          {/* Nhóm 1: Thông tin hoạt động */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="ml-2 block text-sm font-medium text-gray-700 mb-1">
                Tên hoạt động <span className="text-red-500">*</span>
              </label>
              <InputWithIcon
                Icon={Users}
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="ml-2 block text-sm font-medium text-gray-700 mb-1">
                Tổ chức <span className="text-red-500">*</span>
              </label>
              <InputWithIcon
                Icon={Building}
                name="organization"
                value={form.organization}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="ml-2 block text-sm font-medium text-gray-700 mb-1">
                Vai trò
              </label>
              <InputWithIcon
                Icon={User}
                name="role"
                value={form.role}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="ml-2 block text-sm font-medium text-gray-700 mb-1">
                Ngày bắt đầu <span className="text-red-500">*</span>
              </label>
              <InputWithIcon
                Icon={Calendar}
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
                Icon={Clock}
                name="endDate"
                type="date"
                value={form.endDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Mô tả */}
          <div className="relative mt-4">
            <label className="ml-2 block text-sm font-medium text-gray-700 mb-1">
              Mô tả hoạt động
            </label>
            <MdOutlineDescription className="absolute left-3 top-9 w-4 h-4 text-gray-400" />
            <textarea
              name="description"
              placeholder="Mô tả hoạt động, nhiệm vụ, kết quả và đóng góp cá nhân..."
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
              "Cập nhật Hoạt động"
            ) : (
              "Lưu Hoạt động"
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

      {/* 3. Danh sách Hoạt động */}
      <div className="px-6 py-4">
        {isFetching ? (
          <p className="text-gray-500 italic p-4 text-center">
            Đang tải dữ liệu...
          </p>
        ) : error ? (
          <p className="text-red-500 p-3 bg-red-50 border border-red-200 rounded-lg text-sm">
            ⚠️ Không thể tải danh sách hoạt động.
          </p>
        ) : activities.length === 0 ? (
          <p className="text-gray-500 italic p-4 text-center border-2 border-dashed border-gray-200 rounded-lg text-sm">
            ✍️ Thêm các hoạt động ngoại khóa, tình nguyện đã tham gia.
          </p>
        ) : (
          <div className="space-y-4">
            {activities.map((activity: ActivityProps) => (
              <div
                key={activity.id}
                className={`relative group border-l-4 p-4 pl-5 shadow-sm bg-gray-50/70 rounded-lg hover:shadow-md transition duration-300 ${
                  // Viền blue
                  activity.id === editingId
                    ? "border-red-500 ring-2 ring-red-300 bg-red-50"
                    : "border-blue-500"
                }`}
              >
                {/* Action Buttons: Edit/Delete */}
                <div className="absolute top-3 right-4 flex gap-2 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={() => handleEdit(activity)}
                    className="text-gray-500 hover:text-blue-600 transition p-1 rounded hover:bg-white"
                    disabled={isLoading}
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(activity.id as string)}
                    className="text-gray-500 hover:text-red-600 transition p-1 rounded hover:bg-white"
                    disabled={isLoading}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Tên hoạt động và Tổ chức */}
                <div className="flex justify-between items-start mb-3 border-b pb-2 border-cyan-200">
                  <div>
                    <h4 className="text-xl font-extrabold text-cyan-800">
                      <Users size={20} className="inline mr-2 text-cyan-600" />
                      {activity.name}
                    </h4>
                    <p className="text-base font-semibold text-gray-700 mt-0.5 flex items-center">
                      <MapPin size={16} className="mr-2 text-cyan-600" />
                      {activity.organization}
                    </p>
                  </div>
                </div>

                {/* Thông tin Vai trò và Thời gian */}
                <div className="text-sm text-gray-700 space-y-2">
                  {/* Vai trò */}
                  <p className="flex items-center font-semibold">
                    <UserCheck size={14} className="mr-2 text-cyan-500" />
                    Vai trò:{" "}
                    <span className="ml-1 font-medium text-teal-700">
                      {activity.role}
                    </span>
                  </p>

                  {/* Thời gian */}
                  <p className="flex items-center font-medium">
                    <Calendar size={14} className="mr-2 text-cyan-500" />
                    Thời gian:{" "}
                    <span className="ml-1 font-semibold">
                      {formatDate(activity.startDate)}
                    </span>{" "}
                    đến{" "}
                    <span className="ml-1 font-semibold">
                      {formatDate(activity.endDate)}
                    </span>
                  </p>
                </div>

                {/* Mô tả chi tiết */}
                {activity.description && (
                  <div className="pt-3 mt-3 border-t border-cyan-100">
                    <p className="font-semibold text-gray-700 mb-1 flex items-center">
                      <Info size={14} className="mr-2 text-gray-500" />
                      Mô tả hoạt động:
                    </p>
                    {/* Sử dụng whitespace-pre-line để giữ định dạng xuống dòng */}
                    <p className="text-sm text-gray-700 whitespace-pre-line border-l-2 border-cyan-300 pl-3 ml-1">
                      {activity.description}
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

export default ActivityManager;
