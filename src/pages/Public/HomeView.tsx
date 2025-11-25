import PageSection from "../../components/PageSection";
import JobPostingItem from "../../components/Post/JobPostingCard";
import CompanyItem from "../../components/Recruiter/CompanyItem";
import { useGetFeaturedCompaniesQuery } from "../../redux/api/apiCompanySlice";
import { useGetRecommendedJobPostingsQuery } from "../../redux/api/apiPostSlice";

const HomeView = () => {
  const {
    data: jobsResponse,
    isLoading,
    isError,
  } = useGetRecommendedJobPostingsQuery();

  const jobs = jobsResponse?.data?.metadata || jobsResponse?.data || [];

  const {
    data: companiesResponse,
    isLoading: isLoadingCompanies,
    isError: isErrorCompanies,
  } = useGetFeaturedCompaniesQuery();
  const companies =
    companiesResponse?.data?.metadata || companiesResponse?.data || [];
  return (
    <div className="mt-[2rem] mx-[200px]">
      <PageSection title="Công việc phù hợp nhất">
        {isLoading && <p>Đang tải...</p>}
        {isError && <p>Đã xảy ra lỗi khi tải dữ liệu.</p>}
        {!isLoading && !isError && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {jobs.length > 0 ? (
              // 2. Sử dụng JobPostingItem để hiển thị từng công việc
              jobs.map((job: any) => <JobPostingItem key={job.id} job={job} />)
            ) : (
              <p>Không tìm thấy công việc nào.</p>
            )}
          </div>
        )}
      </PageSection>
      <PageSection title="Công việc nổi bật"></PageSection>
      <PageSection title="Doanh nghiệp nổi bật"></PageSection>
      <PageSection title="Doanh nghiệp phù hợp">
        {isLoadingCompanies && <p>Đang tải...</p>}
        {isErrorCompanies && <p>Đã xảy ra lỗi khi tải dữ liệu.</p>}
        {!isLoadingCompanies && !isErrorCompanies && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 mt-4">
            {companies.length > 0 ? (
              companies.map((company: any) => (
                <CompanyItem key={company.id} company={company} />
              ))
            ) : (
              <p>Không tìm thấy doanh nghiệp nào.</p>
            )}
          </div>
        )}
      </PageSection>
    </div>
  );
};

export default HomeView;
