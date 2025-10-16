import AccountInfo from "../../components/AccountInfo";
import PageSection from "../../components/PageSection";
import RecruiterInfo from "../../components/Recruiter/RecruiterInfo";
import { useGetRecruiterProfileQuery } from "../../redux/api/userApiSlice";

const RecruiterProfile = () => {
  const { data: response, isLoading, error } = useGetRecruiterProfileQuery();
  const accountInfo = response?.data;
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
      <PageSection title="Thông tin doanh nghiệp">
        {isLoading ? (
          <p>Đang tải dữ liệu...</p>
        ) : error ? (
          <p>Không thể tải thông tin người dùng.</p>
        ) : (
          <RecruiterInfo recruiter={accountInfo} />
        )}
      </PageSection>
    </div>
  );
};

export default RecruiterProfile;
