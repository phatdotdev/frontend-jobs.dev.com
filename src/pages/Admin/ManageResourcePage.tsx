import { Outlet } from "react-router-dom";

const ManageResourcePage = () => {
  return (
    <div className=" min-h-screen bg-gray-50 p-6 md:p-10 font-sans">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b-2 border-teal-500/50">
        <h1 className="text-4xl font-extrabold text-gray-800 flex items-center gap-2">
          Quản lý Tài Nguyên
        </h1>
      </header>
      <Outlet />
    </div>
  );
};

export default ManageResourcePage;
