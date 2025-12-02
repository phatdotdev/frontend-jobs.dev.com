import type { ReactNode } from "react";
import { Sparkles, TrendingUp, Building2, Briefcase } from "lucide-react";
import { cn } from "../utils/helper";

type SectionType =
  | "recommended"
  | "trending-jobs"
  | "trending-companies"
  | "featured";

const sectionConfigs: Record<
  SectionType,
  {
    icon: ReactNode;
    gradient: string;
    borderColor: string;
    titleColor: string; // ← luôn là đen đậm
    iconColor: string; // ← icon cũng đổi màu cho hợp
    sparklesColor: string;
  }
> = {
  recommended: {
    icon: <Briefcase className="w-6 h-6" />,
    gradient: "from-emerald-500 to-teal-400",
    borderColor: "border-emerald-600",
    titleColor: "text-white",
    iconColor: "text-white",
    sparklesColor: "text-emerald-500",
  },
  "trending-jobs": {
    icon: <TrendingUp className="w-6 h-6" />,
    gradient: "from-orange-500 to-pink-500",
    borderColor: "border-orange-600",
    titleColor: "text-white",
    iconColor: "text-white",
    sparklesColor: "text-orange-500",
  },
  "trending-companies": {
    icon: <Building2 className="w-7 h-7" />,
    gradient: "from-violet-600 to-indigo-600",
    borderColor: "border-violet-700",
    titleColor: "text-white",
    iconColor: "text-white",
    sparklesColor: "text-violet-400",
  },
  featured: {
    icon: <Sparkles className="w-6 h-6" />,
    gradient: "from-cyan-500 to-blue-500",
    borderColor: "border-cyan-600",
    titleColor: "text-white",
    iconColor: "text-white",
    sparklesColor: "text-cyan-400",
  },
};

type PageSectionProps = {
  title: string;
  type?: SectionType;
  children?: ReactNode;
  className?: string;
};

const PageSection = ({
  title,
  type = "featured",
  children,
  className,
}: PageSectionProps) => {
  const config = sectionConfigs[type];

  return (
    <section className={cn("mb-4 group", className)}>
      {/* Tiêu đề */}
      <div className="relative mb-6">
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "relative flex items-center gap-3 px-6 py-3 rounded-xl bg-gradient-to-r shadow-xl",
              "border-l-4 backdrop-blur-md",
              config.gradient,
              config.borderColor,
              "transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
            )}
          >
            {/* Icon - luôn đen đậm, nổi bật trên mọi nền gradient */}
            <div className={config.iconColor}>{config.icon}</div>

            {/* Tiêu đề - CHỮ ĐEN ĐẬM 100% */}
            <h2
              className={cn(
                "text-2xl font-bold tracking-tight",
                config.titleColor,
                "drop-shadow-xl" // bóng đậm để nổi hẳn trên gradient
              )}
            >
              {title}
            </h2>

            {/* Sparkles vẫn giữ màu theo theme */}
            <Sparkles
              className={cn("ml-auto animate-pulse", config.sparklesColor)}
              size={28}
              fill="currentColor"
            />
          </div>
        </div>

        {/* Đường sáng nhẹ dưới tiêu đề */}
        <div className="absolute -bottom-1 left-0 w-32 h-1 bg-white/30 blur-md rounded-full" />
      </div>

      {/* Nội dung */}
      <div className="bg-white/95 backdrop-blur border border-gray-200/80 rounded-2xl shadow-xl p-6 min-h-[100px] transition-all duration-300 hover:shadow-2xl">
        {children ? (
          children
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Sparkles className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-gray-500 font-medium">
              Chưa có nội dung cho mục này
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default PageSection;
