import { useState } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import { MdOutlineAddCircle, MdOutlineDescription } from "react-icons/md";
import { useDispatch } from "react-redux";
import { addToast } from "../../redux/features/toastSlice";
import InputWithIcon from "../../components/UI/InputWithIcon";
import {
  BookOpen,
  Briefcase,
  Calendar,
  Edit3,
  Loader2,
  Trash2,
} from "lucide-react";
import {
  useCreateExpertiseMutation,
  useDeleteExpertiseMutation,
  useGetAllExpertisesQuery,
  useUpdateExpertiseMutation,
} from "../../redux/api/apiUserSlice";
import { FaCalendarAlt } from "react-icons/fa";

const ExpertiseManagerView = () => {
  const [showForm, setShowForm] = useState(false);
  const initialState = {
    id: "",
    title: "",
    field: "",
    description: "",
    yearOfExperience: 0,
  };

  const { data: response, refetch } = useGetAllExpertisesQuery();
  const expertises = response?.data ?? [];

  const [createExpertise, { isLoading: isCreating }] =
    useCreateExpertiseMutation();
  const [updateExpertise] = useUpdateExpertiseMutation();
  const [deleteExpertise] = useDeleteExpertiseMutation();

  const [form, setForm] = useState<any>(initialState);
  const [editingId, setEditingId] = useState<string | null>(null);
  const dispatch = useDispatch();

  const isEditing = !!editingId;
  const isLoading = isCreating;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev: any) => ({ ...prev, [name]: value }));
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
        title: form.title,
        field: form.field,
        description: form.description,
        yearsOfExperience: form.yearsOfExperience,
      };
      console.log(payload);

      if (isEditing) {
        await updateExpertise({ id: editingId, ...payload }).unwrap();
      } else {
        await createExpertise(payload).unwrap();
      }
      dispatch(
        addToast({
          type: "success",
          message: "Cập nhật chuyên môn thành công",
        })
      );
      resetForm();
      refetch();
    } catch (err) {
      dispatch(
        addToast({
          type: "error",
          message: "Có lỗi xảy ra khi tạo chuyên môn",
        })
      );
    }
  };

  const handleEdit = (expertises: any) => {
    setEditingId(expertises.id);
    const editForm = {
      ...expertises,
    };
    setForm(editForm);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa mục chuyên môn này không?")) {
      try {
        await deleteExpertise(id).unwrap();
        dispatch(
          addToast({
            type: "success",
            message: "Cập nhật chuyên môn thành công",
          })
        );
        refetch();
      } catch (err) {
        dispatch(
          addToast({
            type: "error",
            message: "Không thể xóa chuyên môn",
          })
        );
      }
    }
  };

  return (
    <div className="lg:px-[100px]">
      {/* 1. Header & Nút Thêm/Đóng */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
        <h1 className="flex items-center text-xl font-bold text-gray-800"></h1>
        <button
          onClick={() => (showForm ? resetForm() : setShowForm(true))}
          className={`flex items-center text-sm font-semibold transition py-1.5 px-3 rounded-md border ${
            showForm
              ? "bg-white text-gray-600 hover:bg-red-50 hover:text-red-600 border-gray-300"
              : "bg-purple-500 text-white hover:bg-purple-700 border-purple-600 shadow-md"
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
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-purple-50/50 p-6 shadow-inner transition-all duration-300 ease-in-out"
        >
          {/* Nhóm 1: Tiêu đề & Lĩnh vực */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="ml-2 block text-sm font-medium text-gray-700 mb-1">
                Tiêu đề chuyên môn <span className="text-red-500">*</span>
              </label>
              <InputWithIcon
                Icon={Briefcase}
                name="title"
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="ml-2 block text-sm font-medium text-gray-700 mb-1">
                Lĩnh vực <span className="text-red-500">*</span>
              </label>
              <InputWithIcon
                Icon={BookOpen}
                name="field"
                value={form.field}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Nhóm 2: Số năm kinh nghiệm */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <div>
              <label className="ml-2 block text-sm font-medium text-gray-700 mb-1">
                Số năm kinh nghiệm <span className="text-red-500">*</span>
              </label>
              <InputWithIcon
                Icon={Calendar}
                name="yearsOfExperience"
                type="number"
                min="0"
                value={form.yearsOfExperience}
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
              placeholder="Mô tả chi tiết về chuyên môn, kỹ năng, dự án liên quan..."
              value={form.description}
              onChange={handleChange}
              className="border border-gray-300 p-2.5 pl-9 text-sm rounded-lg w-full focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition duration-150"
              rows={3}
            />
          </div>

          {/* Nút Submit/Update */}
          <button
            type="submit"
            disabled={isLoading}
            className="mt-4 bg-purple-600 hover:bg-purple-700 transition text-white font-semibold text-sm px-6 py-2.5 rounded-lg shadow disabled:opacity-50 disabled:cursor-wait"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin h-4 w-4 inline mr-2" /> Đang xử
                lý...
              </>
            ) : isEditing ? (
              "Cập nhật Chuyên môn"
            ) : (
              "Lưu Chuyên môn"
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

      {/* 3. Danh sách Chuyên môn */}
      <div className="px-6 py-4">
        {expertises.length === 0 ? (
          <p className="text-gray-500 italic p-4 text-center border-2 border-dashed border-gray-200 rounded-lg text-sm">
            ✍️ Bắt đầu bằng việc thêm thông tin chuyên môn của bạn.
          </p>
        ) : (
          <div className="space-y-4">
            {expertises.map((exp: any) => (
              <div
                key={exp.id}
                className={`relative group border-l-4 p-4 pl-5 shadow-sm bg-gray-50/70 rounded-lg hover:shadow-md transition duration-300 ${
                  exp.id === editingId
                    ? "border-red-500 ring-2 ring-red-300 bg-red-50"
                    : "border-purple-500"
                }`}
              >
                {/* Action Buttons: Edit/Delete */}
                <div className="absolute top-3 right-4 flex gap-2 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={() => handleEdit(exp)}
                    className="text-gray-500 hover:text-purple-600 transition p-1 rounded hover:bg-white"
                    disabled={isLoading}
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(exp.id)}
                    className="text-gray-500 hover:text-red-600 transition p-1 rounded hover:bg-white"
                    disabled={isLoading}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Nội dung hiển thị */}
                <h3 className="text-lg font-bold text-purple-700 leading-snug pr-20">
                  {exp.title}
                </h3>
                <p className="text-sm font-semibold text-gray-700">
                  Lĩnh vực: {exp.field}
                </p>
                <p className="text-sm text-gray-600">
                  Kinh nghiệm: {exp.yearsOfExperience} năm
                </p>
                {exp.description && (
                  <p className="text-sm text-gray-500 mt-1 italic">
                    {exp.description}
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

export default ExpertiseManagerView;
