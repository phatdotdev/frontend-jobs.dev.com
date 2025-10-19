import { useState } from "react";
import type { AwardProps } from "../../types/ResumeProps";
import {
  useCreateAwardMutation,
  useGetAllAwardsQuery,
} from "../../redux/api/apiResumeSlice";
import { MdOutlineAddCircle } from "react-icons/md";
import { IoMdCloseCircle } from "react-icons/io";
import { FaMedal } from "react-icons/fa";

const AwardManager = () => {
  const {
    data: response,
    isLoading: isFetching,
    error,
    refetch,
  } = useGetAllAwardsQuery();
  const awards = response?.data ?? [];

  const [createAward, { isLoading: isCreating }] = useCreateAwardMutation();
  const [showForm, setShowForm] = useState(false);

  const initialState: AwardProps = {
    id: "",
    name: "",
    organization: "",
    receivedDate: "",
    achievement: "",
    description: "",
    createAt: new Date(),
    updateAt: new Date(),
  };

  const [form, setForm] = useState<AwardProps>(initialState);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createAward(form).unwrap();
      setForm(initialState);
      refetch();
      setShowForm(false);
    } catch (err) {
      console.error("Lỗi khi tạo giải thưởng:", err);
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
          <FaMedal className="mr-2" /> Giải thưởng đã nhận
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
              placeholder="Tên giải thưởng (ví dụ: Giải Nhất Olympic Tin học)"
              value={form.name}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded outline-teal-500"
              required
            />
            <input
              name="organization"
              placeholder="Tổ chức trao giải (ví dụ: Bộ GD&ĐT)"
              value={form.organization}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded outline-teal-500"
              required
            />
            <input
              name="receivedDate"
              type="date"
              value={form.receivedDate}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded outline-teal-500"
              required
            />
            <input
              name="achievement"
              placeholder="Thành tích đạt được (ví dụ: Giải Nhất toàn quốc)"
              value={form.achievement}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded outline-teal-500"
            />
          </div>
          <textarea
            name="description"
            placeholder="Mô tả thêm về giải thưởng, nội dung thi, ý nghĩa..."
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
            {isCreating ? "Đang thêm..." : "Lưu giải thưởng"}
          </button>
        </form>
      )}

      {/* List */}
      <div className="mx-5">
        {isFetching ? (
          <p>Đang tải dữ liệu...</p>
        ) : error ? (
          <p className="text-red-500">Không thể tải danh sách giải thưởng.</p>
        ) : awards.length === 0 ? (
          <p className="text-gray-500 italic">
            Chưa có giải thưởng nào được thêm.
          </p>
        ) : (
          <div className="space-y-4">
            {awards.map((award: AwardProps) => (
              <div
                key={award.id}
                className="border border-gray-200 rounded p-4 shadow-sm bg-white"
              >
                <h3 className="text-md font-bold text-teal-700">
                  {award.name}
                </h3>
                <p className="text-sm text-gray-600">
                  Tổ chức: {award.organization} | Ngày nhận:{" "}
                  {formatDate(award.receivedDate)}
                </p>
                {award.achievement && (
                  <p className="text-sm text-gray-600">
                    Thành tích: {award.achievement}
                  </p>
                )}
                {award.description && (
                  <p className="text-sm text-gray-700 mt-1">
                    {award.description}
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

export default AwardManager;
