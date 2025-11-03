import type { ReactNode } from "react";
import { Sparkles } from "lucide-react";

type HeadingProp = {
  title: string;
  children?: ReactNode;
};

const PageSection = ({ title, children }: HeadingProp) => {
  return (
    <section className="mb-10">
      {/* Tiêu đề */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <h2 className="w-full flex justify-between text-2xl font-bold text-white tracking-tight bg-gradient-to-r from-teal-500 to-teal-100 px-4 py-2 rounded-lg shadow-sm border-l-4 border-teal-500">
          <span>{title}</span>
          <Sparkles className="text-teal-500" size={24} />
        </h2>
      </div>

      {/* Nội dung */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
        {children ? (
          children
        ) : (
          <p className="bg-yellow-50 text-yellow-700 p-3 rounded-lg text-sm font-medium">
            ⚠️ Chưa có nội dung cho mục này.
          </p>
        )}
      </div>
    </section>
  );
};

export default PageSection;
