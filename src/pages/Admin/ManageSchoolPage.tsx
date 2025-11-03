import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  useCreateCertificateMutation,
  useDeleteCertificateMutation,
  useGetAllCertificatesQuery,
  useUpdateCertificateMutation,
} from "../../redux/api/apiAdminSlice";

type Certificate = {
  id: string;
  name: string;
  description: string;
};

const ManageCertificatePage = () => {
  const [editingCertificate, setEditingCertificate] =
    useState<Certificate | null>(null);

  const {
    data: { data: certificates = [] } = {},
    isLoading,
    isError,
    refetch,
  } = useGetAllCertificatesQuery();

  const [createCertificate, { isLoading: creating }] =
    useCreateCertificateMutation();
  const [updateCertificate, { isLoading: updating }] =
    useUpdateCertificateMutation();
  const [deleteCertificate, { isLoading: deleting }] =
    useDeleteCertificateMutation();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<{ name: string; description: string }>();

  useEffect(() => {
    if (editingCertificate) {
      setValue("name", editingCertificate.name);
      setValue("description", editingCertificate.description);
    } else {
      reset();
    }
  }, [editingCertificate, setValue, reset]);

  const onSubmit = async (formData: { name: string; description: string }) => {
    try {
      if (editingCertificate) {
        await updateCertificate({
          id: editingCertificate.id,
          ...formData,
        }).unwrap();
        setEditingCertificate(null);
      } else {
        await createCertificate(formData).unwrap();
      }
      refetch();
      reset();
    } catch (error) {
      alert("Đã xảy ra lỗi khi lưu chứng chỉ.");
    }
  };

  const handleEdit = (certificate: Certificate) => {
    setEditingCertificate(certificate);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (confirm("Bạn có chắc muốn xóa chứng chỉ này?")) {
      try {
        await deleteCertificate(id).unwrap();
        refetch();
      } catch (error) {
        alert("Không thể xóa chứng chỉ.");
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingCertificate(null);
    reset();
  };

  if (isLoading)
    return (
      <div className="max-w-3xl mx-auto p-6 text-center">
        <p className="text-xl text-indigo-600">Đang tải dữ liệu...</p>
      </div>
    );
  if (isError)
    return (
      <div className="max-w-3xl mx-auto p-6 text-center">
        <p className="text-xl text-red-600">
          Không thể tải dữ liệu. Vui lòng thử lại.
        </p>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <header className="mb-8 border-b pb-4 border-teal-100">
        <h2 className="text-3xl font-extrabold text-gray-800 flex items-center">
          📜 Quản lý Chứng chỉ (Certificates)
        </h2>
        <p className="text-gray-500 mt-1">
          Thêm, sửa hoặc xóa các chứng chỉ chuyên môn.
        </p>
      </header>

      {/* Form thêm/sửa */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8">
        <h3 className="text-xl font-bold text-teal-600 mb-4">
          {editingCertificate
            ? `Chỉnh sửa: ${editingCertificate.name}`
            : "Tạo Chứng chỉ Mới"}
        </h3>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {/* Tên chứng chỉ */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Tên chứng chỉ
              </label>
              <input
                {...register("name", {
                  required: "Tên chứng chỉ không được để trống",
                })}
                className={`w-full border ${
                  errors.name ? "border-red-500" : "border-gray-300"
                } rounded-lg px-4 py-2`}
                placeholder="Ví dụ: TOEIC, IELTS, PMP..."
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  ⚠️ {errors.name.message}
                </p>
              )}
            </div>

            {/* Mô tả */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Mô tả
              </label>
              <textarea
                {...register("description")}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                placeholder="Thông tin mô tả về chứng chỉ (không bắt buộc)"
                rows={3}
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={creating || updating}
                className={`px-6 py-2 rounded-lg font-semibold text-white shadow-md transition duration-300 ${
                  editingCertificate
                    ? "bg-amber-500 hover:bg-amber-600"
                    : "bg-teal-600 hover:bg-teal-700"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {creating || updating
                  ? "Đang xử lý..."
                  : editingCertificate
                  ? "Cập nhật"
                  : "Thêm mới"}
              </button>
              {editingCertificate && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition duration-300 shadow-sm"
                >
                  Hủy
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* Danh sách chứng chỉ */}
      <div className="bg-white shadow-xl rounded-xl p-6 border border-gray-100">
        <h3 className="text-2xl font-bold text-gray-800 mb-5 border-b pb-3">
          Danh sách Chứng chỉ ({certificates.length})
        </h3>
        {certificates.length === 0 ? (
          <p className="text-gray-500 italic p-4 bg-gray-50 rounded-lg text-center">
            Không có chứng chỉ nào. Hãy tạo một chứng chỉ mới!
          </p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certificates.map((cert: Certificate) => (
              <li
                key={cert.id}
                className="flex flex-col justify-between bg-white p-4 rounded-lg border border-gray-200 shadow-sm transition duration-300 hover:shadow-md hover:border-teal-300"
              >
                <div>
                  <h4
                    className={`text-lg font-semibold ${
                      editingCertificate?.id === cert.id
                        ? "text-amber-600"
                        : "text-gray-800"
                    }`}
                  >
                    {cert.name}
                    {editingCertificate?.id === cert.id && (
                      <span className="text-sm ml-2">(Đang sửa)</span>
                    )}
                  </h4>
                  {cert.description && (
                    <p className="text-sm text-gray-600 mt-1">
                      {cert.description}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleEdit(cert)}
                    className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50 transition duration-200"
                    title="Chỉnh sửa"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(cert.id)}
                    disabled={deleting}
                    className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50 disabled:opacity-50 transition duration-200"
                    title="Xóa"
                  >
                    🗑️
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ManageCertificatePage;
