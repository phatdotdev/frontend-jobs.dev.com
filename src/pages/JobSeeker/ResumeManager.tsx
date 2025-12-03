import React, { useState, type ChangeEvent } from "react";
import {
  Briefcase,
  BookOpen,
  Target,
  FileText,
  Loader2,
  Save,
  PlusCircle,
  Edit3,
  Trash2,
  List,
  Eye,
  X,
  CheckSquare,
  Download,
  Calendar,
} from "lucide-react";
import {
  useCreateResumeMutation,
  useDeleteResumeMutation,
  useGetAllActivitiesQuery,
  useGetAllAwardsQuery,
  useGetAllCertificationsQuery,
  useGetAllEducationsQuery,
  useGetAllExperiencesQuery,
  useGetAllProjectsQuery,
  useGetAllResumesQuery,
  useGetAllSkillsQuery,
  useUpdateResumeMutation,
} from "../../redux/api/apiResumeSlice";
import CheckboxGroupField from "../../components/UI/CheckBoxGroupField";
import type { ResumeFormProps, ResumeProps } from "../../types/ResumeProps";
import TextAreaField from "../../components/UI/TextAreaField";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { generateResumeFile } from "../../utils/getResumeDocument";
import { formatDate, getImageUrl } from "../../utils/helper";
import { useDispatch } from "react-redux";
import { addToast } from "../../redux/features/toastSlice";

const emptyResume: ResumeFormProps = {
  title: "",
  introduction: "",
  objectCareer: "",
  educations: [],
  experiences: [],
  certifications: [],
  skills: [],
  projects: [],
  awards: [],
  activities: [],
};

const ResumeManager = () => {
  const [form, setForm] = useState<ResumeFormProps>(emptyResume);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // REDIRECT
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect");
  // SELECT
  const { data: educationResponse } = useGetAllEducationsQuery();
  const { data: experienceResponse } = useGetAllExperiencesQuery();
  const { data: skillResponse } = useGetAllSkillsQuery();
  const { data: certificationResponse } = useGetAllCertificationsQuery();
  const { data: projectRespones } = useGetAllProjectsQuery();
  const { data: awardRespones } = useGetAllAwardsQuery();
  const { data: activityRespones } = useGetAllActivitiesQuery();

  const educations =
    educationResponse?.data?.map((education) => ({
      id: education.id as string,
      name: education.schoolName,
    })) ?? [];
  const experiences =
    experienceResponse?.data?.map((experience) => ({
      id: experience.id as string,
      name: experience.companyName,
    })) ?? [];
  const skills =
    skillResponse?.data?.map((skill) => ({
      id: skill.id as string,
      name: skill.name,
    })) ?? [];
  const certifications =
    certificationResponse?.data?.map((certification) => ({
      id: certification.id as string,
      name: certification.name,
    })) ?? [];
  const projects =
    projectRespones?.data?.map((project) => ({
      id: project.id as string,
      name: project.name,
    })) ?? [];
  const awards =
    awardRespones?.data?.map((activity) => ({
      id: activity.id as string,
      name: activity.name,
    })) ?? [];
  const activities =
    activityRespones?.data?.map((activity) => ({
      id: activity.id as string,
      name: activity.name,
    })) ?? [];

  const { data: resumeResponse, refetch } = useGetAllResumesQuery();
  const resumeData = resumeResponse?.data || [];
  const resumes =
    resumeResponse?.data?.map((resume) => ({
      ...resume,
      educations: resume?.educations.map((item) => item.id),
      experiences: resume?.experiences.map((item) => item.id),
      certifications: resume?.certifications.map((item) => item.id),
      skills: resume?.skills?.map((item) => item.id),
      projects: resume?.projects?.map((item) => item.id),
      awards: resume?.awards?.map((item) => item.id),
      activities: resume?.activities?.map((item) => item.id),
    })) ?? [];

  const [createResume] = useCreateResumeMutation();
  const [updateResume] = useUpdateResumeMutation();
  const [deleteResume] = useDeleteResumeMutation();

  const isEditing = !!editingId;

  const dispatch = useDispatch();

  const resetForm = () => {
    setForm(emptyResume);
    setEditingId(null);
    setShowForm(false);
  };

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = {
        title: form.title,
        introduction: form.introduction,
        objectCareer: form.objectCareer,
        educations: form.educations,
        experiences: form.experiences,
        certifications: form.certifications,
        skills: form.skills,
        projects: form.projects,
        awards: form.awards,
        activities: form.activities,
      };
      console.log(payload);
      if (isEditing && form.id) {
        await updateResume({ id: form.id, ...payload }).unwrap();
      } else {
        await createResume(payload).unwrap();
        if (redirect) {
          navigate(redirect);
        }
      }
      resetForm();
      refetch();
    } catch (error) {
      console.error(`Lỗi khi ${isEditing ? "cập nhật" : "tạo"} hồ sơ:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (resume: ResumeFormProps) => {
    setEditingId(resume.id as string);
    setForm(resume);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Bạn có muốn xóa?")) {
      await deleteResume(id);
      refetch();
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (
    e: ChangeEvent<HTMLInputElement>,
    fieldName: keyof ResumeFormProps
  ) => {
    const { value, checked } = e.target;

    setForm((prevForm) => {
      const prevValue = (prevForm[fieldName] || []) as string[];

      const newValues = checked
        ? [...prevValue, value]
        : prevValue.filter((v) => v !== value);

      return {
        ...prevForm,
        [fieldName]: newValues,
      };
    });
  };

  const handleDownload = async (resumeId: string) => {
    const resume = resumeData.filter((resume) => resume.id === resumeId)[0];
    try {
      console.log(resume);
      setIsLoading(true);
      const file = await generateResumeFile(
        resume,
        getImageUrl(resume?.avatarUrl as string)
      );

      const url = URL.createObjectURL(file);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      dispatch(
        addToast({
          type: "success",
          message: "Xuất file thành công!",
        })
      );
    } catch (err) {
      dispatch(
        addToast({
          type: "error",
          message: "Lỗi khi tạo file!",
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen sm:mx-[100px] mt-4 p-4 bg-white shadow-2xl">
      <div className="flex justify-between items-center mb-4">
        <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-800 tracking-tight">
          <FileText className="mr-3 w-8 h-8 text-blue-600" /> Quản lý hồ sơ xin
          việc
        </h1>
        <button
          onClick={() => (showForm ? resetForm() : setShowForm(true))}
          className={`flex items-center text-sm font-semibold transition py-2 px-4 rounded-xl border ${
            showForm
              ? "bg-white text-gray-600 hover:bg-red-50 hover:text-red-600 border-gray-300"
              : "bg-blue-500 text-white hover:bg-blue-600 border-blue-600 shadow-md"
          }`}
          disabled={isLoading}
        >
          {showForm ? (
            <X className="mr-1" size={20} />
          ) : (
            <PlusCircle className="mr-1" size={20} />
          )}
          {showForm ? "Đóng Form" : "Tạo Resume Mới"}
        </button>
      </div>

      {/* HIỂN THỊ FORM TẠO/CHỈNH SỬA */}
      {showForm && (
        <div className="mb-8 p-6 bg-blue-50/50 rounded-xl shadow-inner">
          <h2 className="text-2xl font-bold text-blue-800 mb-4">
            {isEditing ? `Chỉnh Sửa: ${form.title}` : "Tạo Resume Mới"}
          </h2>
          <form onSubmit={handleCreateOrUpdate}>
            <div className="mb-4">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                <Briefcase className="inline w-4 h-4 mr-2 text-blue-600" /> Tiêu
                đề Resume (*)
              </label>
              <input
                type="text"
                name="title"
                id="title"
                placeholder="Ví dụ: Backend Developer CV"
                value={form.title}
                onChange={handleChange}
                required
                className="border border-gray-300 p-2.5 text-base rounded-lg w-full focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                disabled={isLoading}
              />
            </div>

            <TextAreaField
              name="objectCareer"
              placeholder="Mục tiêu nghề nghiệp"
              Icon={Target}
              required={true}
              rows={3}
              // BẮT BUỘC TRUYỀN VALUE, ONCHANGE, ISLOADING
              value={form.objectCareer}
              onChange={handleChange}
              isLoading={isLoading}
            />

            <TextAreaField
              name="introduction"
              placeholder="Lời giới thiệu/Tóm tắt bản thân"
              Icon={BookOpen}
              required={true}
              rows={5}
              // BẮT BUỘC TRUYỀN VALUE, ONCHANGE, ISLOADING
              value={form.introduction}
              onChange={handleChange}
              isLoading={isLoading}
            />

            <hr className="my-6 border-gray-200" />

            {/* CHỌN MỤC LIÊN KẾT (Dùng Checkbox) */}
            <h3 className="flex items-center text-xl font-bold text-gray-700 mb-3">
              <CheckSquare className="w-5 h-5 mr-2 text-blue-600" /> Chọn các
              Mục Chi tiết
            </h3>
            <p className="text-sm text-gray-500 mb-4 italic">
              Đánh dấu chọn các mục Học vấn, Kinh nghiệm, v.v. bạn muốn đưa vào
              Resume này.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <CheckboxGroupField
                fieldName="educations"
                label="Học vấn"
                Icon={BookOpen}
                options={educations}
                formState={form}
                handleCheckboxChange={handleCheckboxChange}
                isLoading={false}
              />
              <CheckboxGroupField
                fieldName="experiences"
                label="Kinh nghiệm làm việc"
                Icon={Briefcase}
                options={experiences}
                formState={form}
                handleCheckboxChange={handleCheckboxChange}
                isLoading={false}
              />
              <CheckboxGroupField
                fieldName="skills"
                label="Kỹ năng"
                Icon={Target}
                options={skills}
                formState={form}
                handleCheckboxChange={handleCheckboxChange}
                isLoading={false}
              />
              <CheckboxGroupField
                fieldName="certifications"
                label="Chứng chỉ"
                Icon={BookOpen}
                options={certifications}
                formState={form}
                handleCheckboxChange={handleCheckboxChange}
                isLoading={false}
              />
              <CheckboxGroupField
                fieldName="projects"
                label="Dự án cá nhân"
                Icon={Briefcase}
                options={projects}
                formState={form}
                handleCheckboxChange={handleCheckboxChange}
                isLoading={false}
              />
              <CheckboxGroupField
                fieldName="awards"
                label="Giải thưởng"
                Icon={Target}
                options={awards}
                formState={form}
                handleCheckboxChange={handleCheckboxChange}
                isLoading={false}
              />
              <CheckboxGroupField
                fieldName="activities"
                label="Hoạt động"
                Icon={BookOpen}
                options={activities}
                formState={form}
                handleCheckboxChange={handleCheckboxChange}
                isLoading={false}
              />
            </div>

            <div className="flex justify-end mt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center bg-blue-600 hover:bg-blue-700 transition text-white font-semibold text-base px-6 py-2.5 rounded-lg shadow disabled:opacity-50 disabled:cursor-wait"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin h-5 w-5 mr-3" />
                ) : (
                  <Save className="h-5 w-5 mr-3" />
                )}
                {isEditing ? "Lưu Cập nhật" : "Tạo Resume"}
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="ml-3 text-gray-600 hover:text-red-600 font-medium text-sm transition"
                  disabled={isLoading}
                >
                  Hủy
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      <hr className="my-6 border-gray-200" />

      {/* HIỂN THỊ DANH SÁCH RESUME (Giữ nguyên) */}
      <h2 className="flex items-center text-2xl font-bold text-gray-800 mb-4">
        Danh sách Resumes của bạn ({resumes.length})
      </h2>

      {resumes.length === 0 ? (
        <p className="text-gray-500 italic p-6 text-center border-2 border-dashed border-gray-200 rounded-lg text-sm">
          Bạn chưa có Resume nào. Hãy nhấp vào **"Tạo Resume Mới"** để bắt đầu!
        </p>
      ) : (
        <div className="space-y-4">
          {resumes.map((resume) => (
            <div
              key={resume.id}
              className={`group relative overflow-hidden rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 border-2 ${
                resume.id === editingId
                  ? "border-red-500 bg-red-50/70 ring-4 ring-red-200"
                  : "border-transparent bg-white hover:border-blue-400"
              }`}
            >
              {/* Hiệu ứng nền gradient khi hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              {/* Nội dung */}
              <div className="relative p-6 flex items-center justify-between gap-6">
                {/* Thông tin CV */}
                <div className="flex items-center gap-5 flex-1 min-w-0">
                  {/* Icon CV đẹp */}
                  <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                    <FileText className="w-8 h-8 text-white" />
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-xl font-extrabold text-gray-900 truncate">
                      {resume.title}
                    </h3>
                    {resume.objectCareer && (
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2 leading-relaxed">
                        {resume.objectCareer}
                      </p>
                    )}
                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        Cập nhật:{" "}
                        {formatDate(
                          resume.updatedAt ? resume.updatedAt : resume.createdAt
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Nút hành động - chỉ hiện khi hover hoặc đang chỉnh sửa */}
                <div
                  className={`flex items-center gap-2 transition-all duration-500 ${
                    resume.id === editingId
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0"
                  }`}
                >
                  <button
                    onClick={() => {
                      {
                        navigate(`${resume.id}`);
                      }
                    }}
                    className="p-3 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 hover:shadow-md transition-all transform hover:scale-110"
                    title="Xem chi tiết"
                  >
                    <Eye className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => handleEdit(resume as any)}
                    className="p-3 bg-orange-100 text-orange-600 rounded-xl hover:bg-orange-200 hover:shadow-md transition-all transform hover:scale-110"
                    title="Chỉnh sửa"
                  >
                    <Edit3 className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => handleDownload(resume.id as string)}
                    className="p-3 bg-emerald-100 text-emerald-600 rounded-xl hover:bg-emerald-200 hover:shadow-md transition-all transform hover:scale-110"
                    title="Tải xuống"
                  >
                    <Download className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => handleDelete(resume.id as string)}
                    className={`p-3 rounded-xl hover:shadow-md transition-all transform hover:scale-110 ${
                      resume.id === editingId
                        ? "bg-red-500 text-white hover:bg-red-600"
                        : "bg-red-100 text-red-600 hover:bg-red-200"
                    }`}
                    title="Xóa CV"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Tag "Đang chỉnh sửa" nếu đang edit */}
              {resume.id === editingId && (
                <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-pulse">
                  Đang chỉnh sửa
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResumeManager;
