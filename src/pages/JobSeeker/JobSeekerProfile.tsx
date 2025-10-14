import AccountInfo from "../../components/AccountInfo";
import JobSeekerInfo from "../../components/JobSeeker/JobSeekerInfo";
import PageSection from "../../components/PageSection";
import { useGetJobSeekerProfileQuery } from "../../redux/api/userApiSlice";

const JobSeekerProfile = () => {
  const { data: response, isLoading, error } = useGetJobSeekerProfileQuery();
  const accountInfo = response?.data;
  const jobSeekerInfo = response?.data;
  return (
    <div className="max-w-[1200px] mx-auto p-4">
      <PageSection title="Thông tin tài khoản">
        {isLoading ? (
          <p>Đang tải dữ liệu...</p>
        ) : error ? (
          <p>Không thể tải thông tin người dùng.</p>
        ) : (
          <AccountInfo accountInfo={accountInfo} />
        )}
      </PageSection>
      <PageSection title="Thông tin ứng viên">
        <JobSeekerInfo jobSeekerInfo={jobSeekerInfo} />
      </PageSection>
    </div>
  );
};

export default JobSeekerProfile;
