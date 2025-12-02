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
  Sparkles,
} from "lucide-react";
import {
  useCreateExpertiseMutation,
  useDeleteExpertiseMutation,
  useGetAllExpertisesQuery,
  useUpdateExpertiseMutation,
} from "../../redux/api/apiUserSlice";

const ExpertiseManagerView = () => {
  const [showForm, setShowForm] = useState(false);
  const initialState = {
    id: "",
    title: "",
    field: "",
    description: "",
    yearsOfExperience: 0,
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

      if (isEditing) {
        await updateExpertise({ id: editingId, ...payload }).unwrap();
      } else {
        await createExpertise(payload).unwrap();
      }
      dispatch(
        addToast({ type: "success", message: "Cập nhật chuyên môn thành công" })
      );
      resetForm();
      refetch();
    } catch (err) {
      dispatch(
        addToast({ type: "error", message: "Có lỗi xảy ra khi tạo chuyên môn" })
      );
    }
  };

  const handleEdit = (exp: any) => {
    setEditingId(exp.id);
    setForm({ ...exp });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa mục chuyên môn này không?")) {
      try {
        await deleteExpertise(id).unwrap();
        dispatch(addToast({ type: "success", message: "Xóa thành công" }));
        refetch();
      } catch (err) {
        dispatch(
          addToast({ type: "error", message: "Không thể xóa chuyên môn" })
        );
      }
    }
  };

  return (
    <div className="lg:px-[100px] py-8">
      {/* Header + Nút Thêm */}
      <div className="mb-8 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800">
              Chuyên môn của bạn
            </h1>
            <p className="text-gray-600 mt-1">
              Quản lý lĩnh vực bạn có thể góp ý hồ sơ
            </p>
          </div>
        </div>

        <button
          onClick={() => (showForm ? resetForm() : setShowForm(true))}
          className={`group flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-300 shadow-lg ${
            showForm
              ? "bg-white text-red-600 border-2 border-red-200 hover:bg-red-50"
              : "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-xl transform hover:scale-105"
          }`}
        >
          {showForm ? (
            <>
              <IoMdCloseCircle size={22} />
              Đóng Form
            </>
          ) : (
            <>
              <MdOutlineAddCircle size={22} />
              Thêm Chuyên môn
            </>
          )}
        </button>
      </div>

      {/* Form Thêm/Sửa */}
      {showForm && (
        <div className="mb-10 bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl shadow-2xl border border-purple-200 p-8 transform transition-all duration-500">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-purple-700 mb-2">
                  <Briefcase className="w-5 h-5" />
                  Tiêu đề chuyên môn
                </label>
                <InputWithIcon
                  Icon={Briefcase}
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="VD: Tuyển dụng IT, Review CV Tech"
                  required
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-purple-700 mb-2">
                  <BookOpen className="w-5 h-5" />
                  Lĩnh vực
                </label>
                <InputWithIcon
                  Icon={BookOpen}
                  name="field"
                  value={form.field}
                  onChange={handleChange}
                  placeholder="VD: Công nghệ thông tin, Marketing"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-purple-700 mb-2">
                  <Calendar className="w-5 h-5" />
                  Số năm kinh nghiệm
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

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-purple-700 mb-2">
                <MdOutlineDescription className="w-5 h-5" />
                Mô tả chi tiết (tùy chọn)
              </label>
              <div className="relative">
                <MdOutlineDescription className="absolute left-4 top-4 w-5 h-5 text-purple-400" />
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Mô tả kỹ năng, dự án tiêu biểu, công ty từng làm..."
                  rows={4}
                  className="w-full pl-12 pr-4 py-4 border border-purple-200 rounded-2xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-300 bg-white/80 backdrop-blur"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="inline animate-spin mr-2" />
                    Đang xử lý...
                  </>
                ) : isEditing ? (
                  "Cập nhật Chuyên môn"
                ) : (
                  "Lưu Chuyên môn"
                )}
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition"
                >
                  Hủy
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Danh sách chuyên môn */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {expertises.length === 0 ? (
          <div className="col-span-full text-center py-20 bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl border-2 border-dashed border-purple-300">
            <Sparkles className="w-16 h-16 mx-auto text-purple-400 mb-4" />
            <p className="text-xl font-semibold text-gray-700">
              Chưa có chuyên môn nào
            </p>
            <p className="text-gray-500 mt-2">
              Nhấn "Thêm Chuyên môn" để bắt đầu
            </p>
          </div>
        ) : (
          expertises.map((exp: any) => (
            <div
              key={exp.id}
              className={`group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border-l-8 ${
                exp.id === editingId
                  ? "border-red-500 ring-4 ring-red-100"
                  : "border-purple-500"
              }`}
            >
              {/* Gradient overlay khi hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Nút Edit/Delete */}
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
                <button
                  onClick={() => handleEdit(exp)}
                  className="p-2.5 bg-white rounded-full shadow-lg hover:bg-purple-50 hover:text-purple-600 transition"
                >
                  <Edit3 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(exp.id)}
                  className="p-2.5 bg-white rounded-full shadow-lg hover:bg-red-50 hover:text-red-600 transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="p-6 relative z-10">
                <h3 className="text-xl font-bold text-purple-700 mb-3 group-hover:text-purple-800 transition">
                  {exp.title}
                </h3>
                <div className="space-y-2 text-sm">
                  <p className="flex items-center gap-2 text-gray-700 font-medium">
                    <BookOpen className="w-4 h-4 text-purple-500" />
                    {exp.field}
                  </p>
                  <p className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4 text-pink-500" />
                    {exp.yearsOfExperience} năm kinh nghiệm
                  </p>
                </div>
                {exp.description && (
                  <p className="mt-4 text-sm text-gray-600 italic line-clamp-3 bg-gray-50 p-4 rounded-xl">
                    {exp.description}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ExpertiseManagerView;
