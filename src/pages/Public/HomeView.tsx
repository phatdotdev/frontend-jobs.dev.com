import PageSection from "../../components/PageSection";
import JobPostingItem from "../../components/Post/JobPostingCard";
import CompanyItem from "../../components/Recruiter/CompanyItem";
import DataLoader from "../../components/UI/DataLoader";
import { useGetFeaturedCompaniesQuery } from "../../redux/api/apiCompanySlice";
import { useGetRecommendedJobPostingsQuery } from "../../redux/api/apiPostSlice";
import {
  useGetTrendingCompaniesQuery,
  useGetTrendingPostingsQuery,
} from "../../redux/api/apiStatisticsSlice";

const HomeView = () => {
  const {
    data: recResp,
    isLoading: loadingRec,
    isError: errRec,
  } = useGetRecommendedJobPostingsQuery();
  const {
    data: trendJobsResp,
    isLoading: loadingTrendJobs,
    isError: errTrendJobs,
  } = useGetTrendingPostingsQuery(6);
  const {
    data: trendCompResp,
    isLoading: loadingTrendComp,
    isError: errTrendComp,
  } = useGetTrendingCompaniesQuery(6);
  const {
    data: featCompResp,
    isLoading: loadingFeat,
    isError: errFeat,
  } = useGetFeaturedCompaniesQuery();

  const recommendedJobs = recResp?.data?.metadata || recResp?.data || [];
  const trendingJobs = trendJobsResp?.data || [];
  const trendingCompanies = trendCompResp?.data || [];
  const featuredCompanies =
    featCompResp?.data?.metadata || featCompResp?.data || [];

  const EmptyState = ({ text }: { text: string }) => (
    <div className="text-center py-4 text-gray-500">
      <p className="text-lg">{text}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* 1. Công việc phù hợp nhất */}
        <PageSection title="Công việc phù hợp nhất" type="recommended">
          {loadingRec ? (
            <DataLoader />
          ) : errRec ? (
            <EmptyState text="Không tải được dữ liệu công việc" />
          ) : recommendedJobs.length === 0 ? (
            <EmptyState text="Chưa có công việc phù hợp với bạn" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedJobs.map((job: any) => (
                <JobPostingItem key={job.id} job={job} />
              ))}
            </div>
          )}
        </PageSection>

        {/* 2. Công việc nổi bật */}
        <PageSection title="Công việc đang hot" type="trending-jobs">
          {loadingTrendJobs ? (
            <DataLoader />
          ) : errTrendJobs ? (
            <EmptyState text="Lỗi tải công việc nổi bật" />
          ) : trendingJobs.length === 0 ? (
            <EmptyState text="Chưa có công việc nào đang hot" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {trendingJobs.map((job: any) => (
                <JobPostingItem key={job.id} job={job} />
              ))}
            </div>
          )}
        </PageSection>

        {/* 3. Doanh nghiệp nổi bật */}
        <PageSection
          title="Doanh nghiệp đang trending"
          type="trending-companies"
        >
          {loadingTrendComp ? (
            <div className="grid grid-cols-2 gap-6">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-200 border-2 border-dashed rounded-xl aspect-square animate-pulse"
                />
              ))}
            </div>
          ) : errTrendComp ? (
            <EmptyState text="Lỗi tải doanh nghiệp nổi bật" />
          ) : trendingCompanies.length === 0 ? (
            <EmptyState text="Chưa có doanh nghiệp nào nổi bật" />
          ) : (
            <div className="grid grid-cols-2 gap-6">
              {trendingCompanies.map((company: any) => (
                <CompanyItem key={company.id} company={company} />
              ))}
            </div>
          )}
        </PageSection>

        {/* 4. Doanh nghiệp phù hợp */}
        <PageSection title="Doanh nghiệp dành cho bạn" type="featured">
          {loadingFeat ? (
            <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-12 gap-6">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-200 border-2 border-dashed rounded-xl aspect-square animate-pulse"
                />
              ))}
            </div>
          ) : errFeat ? (
            <EmptyState text="Lỗi tải danh sách doanh nghiệp" />
          ) : featuredCompanies.length === 0 ? (
            <EmptyState text="Chưa có doanh nghiệp phù hợp" />
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-12 gap-6">
              {featuredCompanies.map((company: any) => (
                <CompanyItem key={company.id} company={company} />
              ))}
            </div>
          )}
        </PageSection>
      </div>
    </div>
  );
};

export default HomeView;
