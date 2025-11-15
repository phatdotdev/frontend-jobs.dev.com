import { Outlet, useNavigate } from "react-router-dom";
import RecruiterPageHeader from "../Recruiter/RecruiterPageHeader";
import { useGetUserInfoQuery } from "../../redux/api/apiUserSlice";

const RecruiterRoute = () => {
  const { data: { data: userInfo } = {}, isLoading } = useGetUserInfoQuery();
  const navigate = useNavigate();
  if (!isLoading && userInfo?.role !== "RECRUITER") {
    navigate("/");
  }
  return (
    <>
      <RecruiterPageHeader />
      <Outlet />
    </>
  );
};

export default RecruiterRoute;
