import React from "react";

type CompanyStatsProps = {
  totalPosts: number;
  totalApplications: number;
  approvalRate: number; // phần trăm duyệt hồ sơ
  avgResponseTime: string; // ví dụ: "2 ngày"
};

const CompanyStats = ({
  totalPosts,
  totalApplications,
  approvalRate,
  avgResponseTime,
}: CompanyStatsProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-lg shadow-sm">
      <div className="text-center">
        <p className="text-2xl font-bold text-teal-600">{totalPosts}</p>
        <p className="text-sm text-gray-600">Bài tuyển dụng</p>
      </div>
      <div className="text-center">
        <p className="text-2xl font-bold text-teal-600">{totalApplications}</p>
        <p className="text-sm text-gray-600">Lượt ứng tuyển</p>
      </div>
      <div className="text-center">
        <p className="text-2xl font-bold text-teal-600">{approvalRate}%</p>
        <p className="text-sm text-gray-600">Tỉ lệ duyệt hồ sơ</p>
      </div>
      <div className="text-center">
        <p className="text-2xl font-bold text-teal-600">{avgResponseTime}</p>
        <p className="text-sm text-gray-600">Thời gian phản hồi</p>
      </div>
    </div>
  );
};

export default CompanyStats;
