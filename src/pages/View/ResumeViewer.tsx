import {
  Briefcase,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  User,
  Zap,
  Award,
  Code,
} from "lucide-react";
import type { ResumeProps } from "../../types/ResumeProps";
import type {
  SkillProps,
  CertificationProps,
  ProjectProps,
} from "../../types/ResumeProps"; // Import thêm các types con
import ErrorAlert from "../../components/UI/ErrorAlert";

type ResumeViewerProps = {
  resume: ResumeProps;
};

const ResumeViewer: React.FC<ResumeViewerProps> = ({ resume }) => {
  if (!resume) return <ErrorAlert />;
  return (
    <div className="p-6 bg-gray-50 border-r border-gray-200 h-full overflow-y-auto">
      <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2 flex items-center">
        <User className="w-5 h-5 mr-2 text-blue-600" /> Thông Tin Hồ Sơ (
        {resume.lastname} {resume.firstname})
      </h2>

      {/* 1. Thông tin liên hệ */}
      <div className="space-y-2 text-sm mb-6 p-3 bg-white border rounded-lg">
        <p className="flex items-center">
          <Phone className="w-4 h-4 mr-2 text-gray-500" /> {resume.phone}
        </p>
        <p className="flex items-center">
          <Mail className="w-4 h-4 mr-2 text-gray-500" /> {resume.email}
        </p>
        <p className="flex items-center">
          <MapPin className="w-4 h-4 mr-2 text-gray-500" /> {resume.address}
        </p>
      </div>

      {/* 2. Mục tiêu nghề nghiệp */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 border-b">
          Giới thiệu bản thân
        </h3>
        <p className="italic text-sm text-gray-700">{resume.introduction}</p>
      </div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 border-b">
          Mục Tiêu Nghề Nghiệp
        </h3>
        <p className="italic text-sm text-gray-700">{resume.objectCareer}</p>
      </div>

      {/* 3. Học vấn */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 border-b flex items-center">
          <GraduationCap className="w-5 h-5 mr-2 text-green-600" /> Học Vấn
        </h3>
        {(resume.educations as any[]).map((edu, index) => (
          <div key={index} className="pl-4 border-l-2 border-green-300 mb-3">
            <p className="font-bold text-gray-900">{edu.major}</p>
            <p className="text-sm text-gray-600">{edu.schoolName}</p>
            <p className="text-xs italic mt-1">
              GPA: {edu.grade} | Thành tích: {edu.description}
            </p>
          </div>
        ))}
      </div>

      {/* 4. Kinh nghiệm */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 border-b flex items-center">
          <Briefcase className="w-5 h-5 mr-2 text-yellow-600" /> Kinh Nghiệm
        </h3>
        {(resume.experiences as any[]).map((exp, index) => (
          <div key={index} className="pl-4 border-l-2 border-yellow-300 mb-3">
            <p className="font-bold text-gray-900">{exp.position}</p>
            <p className="text-sm text-gray-600">{exp.companyName}</p>
            <p className="text-xs mt-1">{exp.description}</p>
          </div>
        ))}
      </div>

      {/* 5. Kỹ năng (Bổ sung mới) */}
      {resume.skills && resume.skills.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 border-b flex items-center">
            <Zap className="w-5 h-5 mr-2 text-blue-600" /> Kỹ Năng
          </h3>
          <div className="flex flex-wrap gap-2">
            {(resume.skills as SkillProps[]).map((skill, index) => (
              <span
                key={index}
                className={`px-3 py-1 text-xs font-semibold rounded-full shadow-sm 
                ${
                  skill.category === "CORE_SKILL"
                    ? "bg-indigo-100 text-indigo-800"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {skill.name} ({skill.level})
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 6. Dự án (Bổ sung mới) */}
      {resume.projects && resume.projects.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 border-b flex items-center">
            <Code className="w-5 h-5 mr-2 text-red-600" /> Dự Án Nổi Bật
          </h3>
          {(resume.projects as ProjectProps[]).map((project, index) => (
            <div key={index} className="pl-4 border-l-2 border-red-300 mb-3">
              <p className="font-bold text-gray-900">
                {project.name} - ({project.role})
              </p>
              <p className="text-sm text-gray-700 italic mt-1">
                {project.description}
              </p>
              <p className="text-xs font-medium text-gray-600 mt-1">
                Kết quả: {project.result}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* 7. Chứng chỉ (Bổ sung mới) */}
      {resume.certifications && resume.certifications.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 border-b flex items-center">
            <Award className="w-5 h-5 mr-2 text-purple-600" /> Chứng Chỉ
          </h3>
          {(resume.certifications as CertificationProps[]).map(
            (cert, index) => (
              <div
                key={index}
                className="pl-4 border-l-2 border-purple-300 mb-3"
              >
                <p className="font-bold text-gray-900">{cert.name}</p>
                <p className="text-sm text-gray-600">
                  Phát hành bởi: {cert.issuer}
                </p>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default ResumeViewer;
