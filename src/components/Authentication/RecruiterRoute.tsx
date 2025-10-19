import { useSelector } from "react-redux";
import type { RootState } from "../../redux/features/store";
import { Outlet, useNavigate } from "react-router-dom";
import RecruiterPageHeader from "../Recruiter/RecruiterPageHeader";

const RecruiterRoute = () => {
  const selectCurrentUser = (state: RootState) => state.authentication.userInfo;
  const userInfo = useSelector(selectCurrentUser);
  const navigate = useNavigate();
  if (!userInfo || userInfo.role !== "RECRUITER") {
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
