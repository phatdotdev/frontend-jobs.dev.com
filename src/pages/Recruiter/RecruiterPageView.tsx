import HorizontalJobList from "../../components/Post/HorizontalJobList";
import CompanyInfo from "../../components/Recruiter/CompanyInfo";
import CompanyStats from "../../components/Recruiter/CompanyStats";
import { useGetMineJobPostingsQuery } from "../../redux/api/postApiSlice";

const RecruiterPageView = () => {
  const { data: response, isLoading, error } = useGetMineJobPostingsQuery();
  if (isLoading) return <p>Đang tải dữ liệu</p>;
  if (error) return <p>Không thể tải dữ liệu</p>;
  const postings = response?.data;
  console.log(response);
  return (
    <div className="mx-[100px] mt-5">
      <h1 className="font-bold text-xl my-4 border-b-4 pb-2 border-teal-500">
        Thống kê tuyển dụng
      </h1>
      {/* <CompanyStats /> */}
      <h1 className="font-bold text-xl my-4 border-b-4 pb-2 border-teal-500">
        Thông tin công ty
      </h1>
      {/* <CompanyInfo /> */}
      <h1 className="font-bold text-xl my-4 border-b-4 pb-2 border-teal-500">
        Bài tuyển dụng gần đây nhất
      </h1>
      <HorizontalJobList postings={postings} />
    </div>
  );
};

export default RecruiterPageView;
