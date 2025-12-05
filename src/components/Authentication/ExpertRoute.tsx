import { Outlet, useNavigate } from "react-router-dom";
import { useGetUserInfoQuery } from "../../redux/api/apiUserSlice";
import ExpertPageHeader from "../Expert/ExpertPageHeader";
import { useEffect } from "react";

const ExpertRoute = () => {
  const { data: { data: userInfo } = {}, isLoading } = useGetUserInfoQuery();
  const navigate = useNavigate();
  useEffect(() => {
    if (!isLoading && userInfo?.role !== "EXPERT") {
      navigate("/");
    } else {
      // navigate("/expert/requests");
    }
  }, []);
  return (
    <>
      <ExpertPageHeader />
      <Outlet />
    </>
  );
};

export default ExpertRoute;
