import JobSeekerProfile from "../../pages/JobSeeker/JobSeekerProfile";
import RecruiterProfile from "../../pages/Recruiter/RecruiterProfile";
import { useGetUserInfoQuery } from "../../redux/api/userApiSlice";

const ProfileBasedRole = () => {
  const { data: { data: userInfo } = {} } = useGetUserInfoQuery();
  const role = userInfo?.role;
  if (role === "JOBSEEKER") return <JobSeekerProfile />;
  else if (role === "RECRUITER") return <RecruiterProfile />;
  else return <p>Bạn chưa đăng nhập vào hệ thống</p>;
};

export default ProfileBasedRole;
