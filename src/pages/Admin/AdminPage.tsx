import { Outlet, useNavigate } from "react-router-dom";
import AdminNavigation from "./AdminNavigation";
import { useGetUserInfoQuery } from "../../redux/api/apiUserSlice";
import { useEffect } from "react";

const AdminPage = () => {
  const { data: { data: userInfo } = {}, isLoading } = useGetUserInfoQuery();
  const navigation = useNavigate();
  useEffect(() => {
    if (!isLoading && userInfo?.role !== "ADMIN") {
      navigation("/");
    }
  }, []);
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="bg-white shadow-md border-r">
        <AdminNavigation />
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-auto bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminPage;
