import { useState } from "react";
import ActivityManager from "../../components/JobSeeker/ActivityManager";
import AwardManager from "../../components/JobSeeker/AwardManager";
import CertificationManager from "../../components/JobSeeker/CertificationManager";
import EducationManager from "../../components/JobSeeker/EducationManager";
import ExperienceManager from "../../components/JobSeeker/ExperienceManager";
import ProjectManager from "../../components/JobSeeker/ProjectManager";
import SkillManager from "../../components/JobSeeker/SkillManager";

import {
  FaGraduationCap,
  FaBriefcase,
  FaTools,
  FaCertificate,
  FaLaptopCode,
  FaMedal,
  FaUsers,
} from "react-icons/fa";
import { LayoutDashboard, TicketCheck, User } from "lucide-react";

const tabConfig = [
  {
    id: "education",
    name: "Học vấn",
    icon: FaGraduationCap,
    component: EducationManager,
  },
  {
    id: "experience",
    name: "Kinh nghiệm",
    icon: FaBriefcase,
    component: ExperienceManager,
  },
  { id: "skills", name: "Kỹ năng", icon: FaTools, component: SkillManager },
  {
    id: "projects",
    name: "Dự án",
    icon: FaLaptopCode,
    component: ProjectManager,
  },
  {
    id: "certifications",
    name: "Chứng chỉ",
    icon: TicketCheck,
    component: CertificationManager,
  },
  { id: "awards", name: "Giải thưởng", icon: FaMedal, component: AwardManager },
  {
    id: "activities",
    name: "Hoạt động",
    icon: FaUsers,
    component: ActivityManager,
  },
];

const JobSeekerPageView = () => {
  const [activeTab, setActiveTab] = useState(tabConfig[0].id);

  const ActiveComponent =
    tabConfig.find((tab) => tab.id === activeTab)?.component || null;

  return (
    <div className="sm:mx-[100px] mt-4 p-4 bg-white shadow-2xl">
      <div className="flex justify-between items-center mb-4">
        <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-800 tracking-tight">
          <User className="mr-3 w-8 h-8 text-blue-600" /> Quản lý hồ sơ cá nhân
        </h1>
      </div>

      <hr className="mt-6 border-gray-200" />

      <div className="bg-white rounded-xl shadow-lg min-h-screen">
        <div className="flex flex-wrap border-b border-gray-200 px-6 gap-4">
          {tabConfig.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                text-[1.125rem] flex items-center px-4 py-3 text-sm font-semibold transition duration-200 
                border-b-2 
                ${
                  activeTab === tab.id
                    ? "text-blue-600 border-blue-500"
                    : "text-gray-500 border-transparent hover:text-blue-500 hover:border-gray-300"
                }
              `}
            >
              <tab.icon className="mr-2 w-4 h-4" />
              {tab.name}
            </button>
          ))}
        </div>

        {/* Nội dung Tab */}
        <div className="p-4 sm:p-6">
          {ActiveComponent && <ActiveComponent />}
        </div>
      </div>
    </div>
  );
};

export default JobSeekerPageView;
