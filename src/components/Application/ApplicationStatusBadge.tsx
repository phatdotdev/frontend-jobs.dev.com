// src/components/UI/ApplicationStatusBadge.tsx
import {
  Send,
  Eye,
  AlertCircle,
  Mic,
  CheckCircle,
  UserCheck,
  XCircle,
  Clock,
} from "lucide-react";

type ApplicationState =
  | "SUBMITTED"
  | "REVIEWING"
  | "REQUESTED"
  | "INTERVIEW"
  | "ACCEPTED"
  | "HIRED"
  | "REJECTED"
  | "CANCELLED";

const statusConfig: Record<
  ApplicationState,
  {
    label: string;
    icon: React.ElementType;
    color: string;
    bg: string;
    ring: string;
  }
> = {
  SUBMITTED: {
    label: "Đã gửi",
    icon: Send,
    color: "text-blue-700",
    bg: "bg-blue-50",
    ring: "ring-blue-300",
  },
  REVIEWING: {
    label: "Đang xét duyệt",
    icon: Eye,
    color: "text-amber-700",
    bg: "bg-amber-50",
    ring: "ring-amber-300",
  },
  REQUESTED: {
    label: "Yêu cầu bổ sung",
    icon: AlertCircle,
    color: "text-purple-700",
    bg: "bg-purple-50",
    ring: "ring-purple-300",
  },
  INTERVIEW: {
    label: "Phỏng vấn",
    icon: Mic,
    color: "text-indigo-700",
    bg: "bg-indigo-50",
    ring: "ring-indigo-300",
  },
  ACCEPTED: {
    label: "Được chấp nhận",
    icon: CheckCircle,
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    ring: "ring-emerald-300",
  },
  HIRED: {
    label: "Đã nhận việc",
    icon: UserCheck,
    color: "text-green-700",
    bg: "bg-green-50",
    ring: "ring-green-400",
  },
  REJECTED: {
    label: "Không đạt",
    icon: XCircle,
    color: "text-red-700",
    bg: "bg-red-50",
    ring: "ring-red-300",
  },
  CANCELLED: {
    label: "Đã hủy",
    icon: XCircle,
    color: "text-gray-700",
    bg: "bg-gray-50",
    ring: "ring-gray-300",
  },
};

interface ApplicationStatusBadgeProps {
  state: ApplicationState;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

const ApplicationStatusBadge: React.FC<ApplicationStatusBadgeProps> = ({
  state,
  size = "md",
  showLabel = true,
}) => {
  const config = statusConfig[state] || statusConfig.SUBMITTED;
  const Icon = config.icon;

  const sizeClasses = {
    sm: "w-7 h-7",
    md: "w-9 h-9",
    lg: "w-11 h-11",
  };

  const textSize = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  return (
    <div
      className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-full font-semibold ${config.bg} ${config.color} ring-4 ${config.ring} ring-opacity-30 shadow-sm transition-all hover:shadow-md`}
    >
      <div
        className={`p-1.5 rounded-full bg-white shadow-sm ${config.ring} ring-2 ring-opacity-50`}
      >
        <Icon className={`${sizeClasses[size]} ${config.color}`} />
      </div>
      {showLabel && (
        <span className={`font-bold ${textSize[size]}`}>{config.label}</span>
      )}
    </div>
  );
};

export default ApplicationStatusBadge;
