import type { ReactNode } from "react";

type HeadingProp = {
  title: string;
  children: ReactNode;
};

const PageSection = ({ title, children }: HeadingProp) => {
  return (
    <>
      <h1 className="border-l-6 border-gray-700 w-full bg-gradient-to-r from-teal-300 to-teal-100 text-lg font-semibold text-gray-800 p-2 mb-2 rounded-r-lg shadow-sm">
        {title}
      </h1>
      <div className="mb-6">
        {children ? (
          children
        ) : (
          <p className="bg-red-100 p-2 rounded text-red-600 m-2">
            Chưa có nội dung
          </p>
        )}
      </div>
    </>
  );
};

export default PageSection;
