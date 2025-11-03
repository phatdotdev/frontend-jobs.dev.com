import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import {
  useCreateLocationMutation,
  useDeleteLocationMutation,
  useGetAllLocationsQuery,
  useUpdateLocationMutation,
} from "../../redux/api/apiAdminSlice";

type Location = {
  id: number;
  name: string;
};

const ManageLocationPage = () => {
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);

  const {
    data: { data: locations = [] } = {},
    isLoading,
    isError,
    refetch,
  } = useGetAllLocationsQuery();

  const [createLocation, { isLoading: creating }] = useCreateLocationMutation();
  const [updateLocation, { isLoading: updating }] = useUpdateLocationMutation();
  const [deleteLocation, { isLoading: deleting }] = useDeleteLocationMutation();

  const formRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setFocus,
    formState: { errors },
  } = useForm<{ name: string }>();

  useEffect(() => {
    if (editingLocation) {
      setValue("name", editingLocation.name);
    } else {
      reset();
    }
  }, [editingLocation, setValue, reset]);

  const onSubmit = async ({ name }: { name: string }) => {
    try {
      if (editingLocation) {
        await updateLocation({ id: editingLocation.id, name }).unwrap();
        setEditingLocation(null);
      } else {
        await createLocation(name).unwrap();
      }
      refetch();
      reset();
    } catch (error) {
      alert("Đã xảy ra lỗi khi lưu địa điểm.");
    }
  };

  const handleEdit = (location: Location) => {
    setEditingLocation(location);
    setFocus("name");
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleDelete = async (id: number) => {
    if (confirm("Bạn có chắc muốn xóa địa điểm này?")) {
      try {
        await deleteLocation(id).unwrap();
        refetch();
      } catch (error) {
        alert("Không thể xóa địa điểm.");
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingLocation(null);
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
          📍 Quản lý Địa điểm (Locations)
        </h2>
        <p className="text-gray-500 mt-1">
          Thêm, sửa hoặc xóa các địa điểm hoạt động.
        </p>
      </header>

      <div
        ref={formRef}
        className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8"
      >
        <h3 className="text-xl font-bold text-teal-600 mb-4">
          {editingLocation
            ? `Chỉnh sửa: ${editingLocation.name}`
            : "Tạo Địa điểm Mới"}
        </h3>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col sm:flex-row gap-3 items-start">
            <div className="flex-grow w-full">
              <input
                {...register("name", {
                  required: "Tên địa điểm không được để trống",
                })}
                className={`w-full border ${
                  errors.name
                    ? "border-red-500"
                    : "border-gray-300 focus:border-teal-500"
                } rounded-lg px-4 py-2 transition duration-200 focus:ring-1 focus:ring-teal-500 shadow-sm`}
                placeholder="Ví dụ: Hà Nội, TP.HCM, Đà Nẵng..."
                autoFocus={true}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  ⚠️ {errors.name.message}
                </p>
              )}
            </div>

            <div className="flex gap-3 mt-2 sm:mt-0">
              <button
                type="submit"
                disabled={creating || updating}
                className={`flex items-center justify-center px-6 py-2 rounded-lg font-semibold text-white shadow-md transition duration-300 text-nowrap
                  ${
                    editingLocation
                      ? "bg-amber-500 hover:bg-amber-600"
                      : "bg-teal-600 hover:bg-teal-700"
                  }
                  disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {creating || updating ? (
                  <span className="animate-spin mr-2">🔄</span>
                ) : editingLocation ? (
                  "Cập nhật"
                ) : (
                  "Thêm mới"
                )}
              </button>
              {editingLocation && (
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

      <div className="bg-white shadow-xl rounded-xl p-6 border border-gray-100">
        <h3 className="text-2xl font-bold text-gray-800 mb-5 border-b pb-3">
          Danh sách Địa điểm ({locations.length})
        </h3>
        {locations.length === 0 ? (
          <p className="text-gray-500 italic p-4 bg-gray-50 rounded-lg text-center">
            Không có địa điểm nào. Hãy tạo một địa điểm mới!
          </p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {locations.map((location: Location) => (
              <li
                key={location.id}
                className="flex justify-between items-center bg-white p-4 rounded-lg border border-gray-200 shadow-sm transition duration-300 hover:shadow-md hover:border-teal-300"
              >
                <span
                  className={`text-lg font-medium ${
                    editingLocation?.id === location.id
                      ? "text-amber-600 font-bold"
                      : "text-gray-700"
                  }`}
                >
                  {location.name}
                  {editingLocation?.id === location.id && (
                    <span className="text-sm ml-2">(Đang sửa)</span>
                  )}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(location)}
                    className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50 transition duration-200"
                    title="Chỉnh sửa địa điểm"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(location.id)}
                    disabled={deleting}
                    className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50 disabled:opacity-50 transition duration-200"
                    title="Xóa địa điểm"
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

export default ManageLocationPage;
