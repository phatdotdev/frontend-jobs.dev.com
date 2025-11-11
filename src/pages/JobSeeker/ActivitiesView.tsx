import { Activity } from "lucide-react";

const ActivitiesView = () => {
  return (
    <div className="sm:mx-[100px] mt-4 p-4 bg-white shadow-2xl">
      <div className="flex justify-between items-center mb-4">
        <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-800 tracking-tight">
          <Activity className="mr-3 w-8 h-8 text-blue-600" /> Lịch sử hoạt động
        </h1>
      </div>
    </div>
  );
};

export default ActivitiesView;
