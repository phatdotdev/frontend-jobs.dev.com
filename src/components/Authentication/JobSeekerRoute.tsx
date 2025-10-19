import { Outlet } from "react-router-dom";
import JobSeekerPageHeader from "../JobSeeker/JobSeekerPageHeader";

const JobSeekerRoute = () => {
  return (
    <>
      <JobSeekerPageHeader />
      <Outlet />
    </>
  );
};

export default JobSeekerRoute;
