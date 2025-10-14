type JobSeekerInfoProp = {
  firstname: string;
  lastname: string;
  dob: string;
};

const JobSeekerInfo = ({
  jobSeekerInfo,
}: {
  jobSeekerInfo: JobSeekerInfoProp;
}) => {
  return (
    <div className="space-y-4 grid grid-cols-2 gap-4">
      <div>
        <label
          htmlFor="username"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Họ ứng viên
        </label>
        <input
          type="text"
          value={jobSeekerInfo?.firstname || "Chưa cập nhật"}
          readOnly
          className="w-full px-3 py-2 border rounded-md bg-gray-100 text-gray-800"
        />
      </div>

      <div>
        <label
          htmlFor="username"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Tên ứng viên
        </label>
        <input
          type="text"
          value={jobSeekerInfo?.lastname || "Chưa cập nhật"}
          readOnly
          className="w-full px-3 py-2 border rounded-md bg-gray-100 text-gray-800"
        />
      </div>
    </div>
  );
};

export default JobSeekerInfo;
