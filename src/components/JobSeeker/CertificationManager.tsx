import { useState } from "react";
import type { CertificationProps } from "../../types/ResumeProps";
import {
  useCreateCertificationMutation,
  useGetAllCertificationsQuery,
} from "../../redux/api/apiResumeSlice";
import { MdOutlineAddCircle } from "react-icons/md";
import { IoMdCloseCircle } from "react-icons/io";
import { FaCertificate } from "react-icons/fa";

const CertificationManager = () => {
  const {
    data: response,
    isLoading: isFetching,
    error,
    refetch,
  } = useGetAllCertificationsQuery();
  const certifications = response?.data ?? [];

  const [createCertification, { isLoading: isCreating }] =
    useCreateCertificationMutation();
  const [showForm, setShowForm] = useState(false);

  const initialState: CertificationProps = {
    id: "",
    name: "",
    organization: "",
    issueDate: "",
    expirationDate: "",
    description: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const [form, setForm] = useState<CertificationProps>(initialState);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCertification(form).unwrap();
      setForm(initialState);
      refetch();
      setShowForm(false);
    } catch (err) {
      console.error("Lỗi khi tạo chứng chỉ:", err);
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
        <h1 className="flex items-center text-2xl text-indigo-600 font-bold">
          <FaCertificate className="mr-2" /> Chứng chỉ chuyên môn
        </h1>
        <button
          onClick={() => setShowForm((prev) => !prev)}
          className={`flex items-center transition text-white px-4 py-2 rounded shadow ${
            !showForm
              ? "bg-indigo-500 hover:bg-indigo-600"
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
              placeholder="Tên chứng chỉ (ví dụ: AWS Certified Developer)"
              value={form.name}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded outline-indigo-500"
              required
            />
            <input
              name="organization"
              placeholder="Tổ chức cấp (ví dụ: Amazon Web Services)"
              value={form.organization}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded outline-indigo-500"
              required
            />
            <input
              name="issueDate"
              type="date"
              value={form.issueDate}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded outline-indigo-500"
              required
            />
            <input
              name="expirationDate"
              type="date"
              value={form.expirationDate}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded outline-indigo-500"
            />
          </div>
          <textarea
            name="description"
            placeholder="Mô tả nội dung chứng chỉ, phạm vi, kỹ năng..."
            value={form.description}
            onChange={handleChange}
            className="mt-4 border border-gray-300 p-2 rounded w-full outline-indigo-500"
            rows={3}
          />
          <button
            type="submit"
            disabled={isCreating}
            className="mt-4 bg-indigo-500 hover:bg-indigo-600 transition text-white px-6 py-2 rounded shadow"
          >
            {isCreating ? "Đang thêm..." : "Lưu chứng chỉ"}
          </button>
        </form>
      )}

      {/* List */}
      <div className="mx-5">
        {isFetching ? (
          <p>Đang tải dữ liệu...</p>
        ) : error ? (
          <p className="text-red-500">Không thể tải danh sách chứng chỉ.</p>
        ) : certifications.length === 0 ? (
          <p className="text-gray-500 italic">
            Chưa có chứng chỉ nào được thêm.
          </p>
        ) : (
          <div className="space-y-4">
            {certifications.map((cert: CertificationProps) => (
              <div
                key={cert.id}
                className="border border-gray-200 rounded p-4 shadow-sm bg-white"
              >
                <h3 className="text-md font-bold text-indigo-700">
                  {cert.name}
                </h3>
                <p className="text-sm text-gray-600">
                  Tổ chức: {cert.organization}
                </p>
                <p className="text-sm text-gray-600">
                  Cấp ngày: {formatDate(cert.issueDate)}{" "}
                  {cert.expirationDate &&
                    `| Hết hạn: ${formatDate(cert.expirationDate)}`}
                </p>
                {cert.description && (
                  <p className="text-sm text-gray-700 mt-1">
                    {cert.description}
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

export default CertificationManager;
