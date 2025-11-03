import ActivityManager from "../../components/JobSeeker/ActivityManager";
import AwardManager from "../../components/JobSeeker/AwardManager";
import CertificationManager from "../../components/JobSeeker/CertificationManager";
import EducationManager from "../../components/JobSeeker/EducationManager";
import ExperienceManager from "../../components/JobSeeker/ExperienceManager";
import ProjectManager from "../../components/JobSeeker/ProjectManager";
import SkillManager from "../../components/JobSeeker/SkillManager";

const JobSeekerPageView = () => {
  return (
    <div className="sm:mx-[100px] mt-4">
      <EducationManager />
      <ExperienceManager />
      <SkillManager />
      <CertificationManager />
      <ProjectManager />
      <AwardManager />
      <ActivityManager />
    </div>
  );
};

export default JobSeekerPageView;
