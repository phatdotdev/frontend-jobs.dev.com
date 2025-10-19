import { useState } from "react";
import type { ActivityProps } from "../../types/ResumeProps";
import {
  useCreateActivityMutation,
  useGetAllActivitiesQuery,
} from "../../redux/api/apiResumeSlice";
import { MdOutlineAddCircle } from "react-icons/md";
import { IoMdCloseCircle } from "react-icons/io";
import { FaThList } from "react-icons/fa";
import { MdGroups } from "react-icons/md";

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
  const [showForm, setShowForm] = useState(false);

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createActivity(form).unwrap();
      setForm(initialState);
      refetch();
      setShowForm(false);
    } catch (err) {
      console.error("Lỗi khi tạo hoạt động:", err);
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
          <MdGroups className="mr-2" /> Hoạt động đã tham gia
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
              placeholder="Tên hoạt động (ví dụ: Tình nguyện Mùa hè xanh)"
              value={form.name}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded outline-teal-500"
              required
            />
            <input
              name="organization"
              placeholder="Tổ chức (ví dụ: Đoàn trường, CLB Kỹ năng)"
              value={form.organization}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded outline-teal-500"
              required
            />
            <input
              name="role"
              placeholder="Vai trò (ví dụ: Trưởng nhóm, Thành viên)"
              value={form.role}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded outline-teal-500"
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
            placeholder="Mô tả hoạt động, nhiệm vụ, kết quả..."
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
            {isCreating ? "Đang thêm..." : "Lưu hoạt động"}
          </button>
        </form>
      )}

      {/* List */}
      <div className="mx-5">
        {isFetching ? (
          <p>Đang tải dữ liệu...</p>
        ) : error ? (
          <p className="text-red-500">Không thể tải danh sách hoạt động.</p>
        ) : activities.length === 0 ? (
          <p className="text-gray-500 italic">
            Chưa có hoạt động nào được thêm.
          </p>
        ) : (
          <div className="space-y-4">
            {activities.map((activity: ActivityProps) => (
              <div
                key={activity.id}
                className="border border-gray-200 rounded p-4 shadow-sm bg-white"
              >
                <h3 className="text-md font-bold text-teal-700">
                  {activity.name}
                </h3>
                <p className="text-sm text-gray-600">
                  Tổ chức: {activity.organization} | Vai trò: {activity.role}
                </p>
                <p className="text-sm text-gray-600">
                  {formatDate(activity.startDate)} →{" "}
                  {formatDate(activity.endDate)}
                </p>
                {activity.description && (
                  <p className="text-sm text-gray-700 mt-1">
                    {activity.description}
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

export default ActivityManager;
