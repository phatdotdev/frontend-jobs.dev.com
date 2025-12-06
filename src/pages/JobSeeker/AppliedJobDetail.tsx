import { useParams } from "react-router-dom";
import AppliedJobCard from "../../components/Application/AppliedJobCard";
import { useGetApplicationByIdQuery } from "../../redux/api/apiApplicationSlice";
import DataLoader from "../../components/UI/DataLoader";

const AppliedJobDetail = () => {
  const { id } = useParams();
  const { data: response, isLoading, refetch } = useGetApplicationByIdQuery(id);

  if (isLoading) {
    return <DataLoader />;
  }
  return (
    <div className="sm:mx-[100px] mt-4 p-4 bg-white shadow-2xl">
      <AppliedJobCard refetch={refetch} application={response?.data} />
    </div>
  );
};

export default AppliedJobDetail;
