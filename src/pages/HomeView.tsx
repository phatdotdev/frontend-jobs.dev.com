import PageSection from "../components/PageSection";
import Heading from "../components/PageSection";

const HomeView = () => {
  return (
    <div className="mt-[2rem] mx-[200px]">
      <PageSection title="Công việc phù hợp nhất"></PageSection>
      <PageSection title="Công việc nổi bật"></PageSection>
      <PageSection title="Doanh nghiệp nổi bật"></PageSection>
    </div>
  );
};

export default HomeView;
