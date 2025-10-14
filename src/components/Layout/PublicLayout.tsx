import { Outlet } from "react-router-dom";
import PublicNavigation from "../PublicNavigation";

const PublicLayout = () => {
  return (
    <>
      <PublicNavigation />
      <Outlet />
    </>
  );
};

export default PublicLayout;
