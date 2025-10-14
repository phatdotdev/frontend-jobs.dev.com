import { useSelector } from "react-redux";
import JobSeekerProfile from "../../pages/JobSeeker/JobSeekerProfile";
import RecruiterProfile from "../../pages/Recruiter/RecruiterProfile";
import type { RootState } from "../../redux/features/store";

const ProfileBasedRole = () => {
  const selectCurrentUser = (state: RootState) => state.authentication.userInfo;
  const userInfo = useSelector(selectCurrentUser);
  const role = userInfo?.role;
  if (role === "JOBSEEKER") return <JobSeekerProfile />;
  else if (role === "RECRUITER") return <RecruiterProfile />;
  else return <p>Unauthenticated</p>;
};

export default ProfileBasedRole;
