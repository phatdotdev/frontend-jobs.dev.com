// src/components/ApplicationProgressBar.tsx
import { format } from "date-fns";
import {
  Check,
  X,
  Clock,
  FileText,
  Users,
  Briefcase,
  AlertCircle,
  Ban,
  Award,
} from "lucide-react";

type Application = {
  state:
    | "SUBMITTED"
    | "REVIEW"
    | "REVIEWING"
    | "REQUESTED"
    | "ACCEPTED"
    | "INTERVIEW"
    | "HIRED"
    | "REJECTED";
  appliedAt?: string | null;
  requestedAt?: string | null;
  acceptedAt?: string | null;
  interviewAt?: string | null;
  hiredAt?: string | null;
  rejectedAt?: string | null;
};

const steps = [
  { label: "Nộp hồ sơ", defaultIcon: FileText },
  { label: "Xét duyệt", defaultIcon: Clock },
  { label: "Phỏng vấn", defaultIcon: Users },
  { label: "Kết quả", defaultIcon: Briefcase },
];

export default function ApplicationProgressBar({ app }: { app: Application }) {
  const {
    state,
    appliedAt,
    requestedAt,
    acceptedAt,
    interviewAt,
    hiredAt,
    rejectedAt,
  } = app;

  // Xác định bước hiện tại và trạng thái từ chối
  const getProgress = () => {
    // Trường hợp bị từ chối
    if (state === "REJECTED" || rejectedAt) {
      if (acceptedAt) {
        // Đã từng được chấp nhận → bị loại sau phỏng vấn → bước 4
        return { currentStep: 4, isRejected: true, rejectedAtStep: 4 };
      } else {
        // Chưa từng được accepted → bị loại ở bước xét duyệt → bước 2
        return { currentStep: 2, isRejected: true, rejectedAtStep: 2 };
      }
    }

    // Trường hợp được nhận việc
    if (state === "HIRED" || hiredAt) {
      return { currentStep: 4, status: "hired" };
    }

    // Đang phỏng vấn
    if (state === "INTERVIEW" || interviewAt) {
      return { currentStep: 3, status: "interview" };
    }

    // Hồ sơ đã được chấp nhận (đi phỏng vấn)
    if (state === "ACCEPTED" || acceptedAt) {
      return { currentStep: 3, status: "accepted" };
    }

    // Yêu cầu bổ sung / đang xét duyệt
    if (state === "REQUESTED" || requestedAt) {
      return { currentStep: 2, status: "requested" };
    }

    if (state === "REVIEW" || state === "REVIEWING") {
      return { currentStep: 2, status: "reviewing" };
    }

    // Đã nộp hồ sơ → bước 1 hoàn thành
    if (state === "SUBMITTED" || appliedAt) {
      return { currentStep: 1, status: "submitted" };
    }

    return { currentStep: 1, status: "pending" };
  };

  const {
    currentStep,
    isRejected,
    rejectedAtStep,
    status = "pending",
  } = getProgress();

  const statusConfig: Record<string, any> = {
    submitted: { color: "bg-green-500", ring: "ring-green-200", icon: Check },
    reviewing: { color: "bg-amber-500", ring: "ring-amber-200", icon: Clock },
    requested: {
      color: "bg-purple-500",
      ring: "ring-purple-200",
      icon: AlertCircle,
    },
    accepted: { color: "bg-yellow-500", ring: "ring-yellow-200", icon: Check },
    interview: { color: "bg-indigo-500", ring: "ring-indigo-200", icon: Users },
    hired: { color: "bg-emerald-600", ring: "ring-emerald-300", icon: Award },
  };

  const getStepDisplay = (stepIndex: number) => {
    const isPast = stepIndex < currentStep;
    const isCurrent = stepIndex === currentStep;
    const isFuture = stepIndex > currentStep;

    // Nếu bị từ chối: tô đỏ từ bước bị loại trở đi
    if (isRejected && stepIndex >= (rejectedAtStep || currentStep)) {
      return {
        bg: "bg-red-600 text-white",
        ring: "ring-red-300",
        icon: X,
        labelColor: "text-red-600",
      };
    }

    // Các bước đã hoàn thành (xanh)
    if (isPast || (isCurrent && status === "hired")) {
      return {
        bg: "bg-green-500 text-white",
        ring: "ring-green-200",
        icon: Check,
        labelColor: "text-gray-800",
      };
    }

    // Bước hiện tại
    if (isCurrent) {
      if (status === "hired") {
        return {
          bg: "bg-emerald-600 text-white",
          ring: "ring-emerald-300",
          icon: Award,
          labelColor: "text-emerald-700",
        };
      }
      const cfg = statusConfig[status] || statusConfig.submitted;
      return {
        bg: cfg.color + " text-white",
        ring: cfg.ring,
        icon: cfg.icon,
        labelColor: "text-gray-900",
      };
    }

    // Bước tương lai → xám
    return {
      bg: "bg-gray-300 text-gray-600",
      ring: "ring-gray-200",
      icon: steps[stepIndex - 1].defaultIcon,
      labelColor: "text-gray-500",
    };
  };

  const getStatusText = () => {
    if (isRejected)
      return `Bị từ chối ${
        rejectedAt ? format(new Date(rejectedAt), "dd/MM/yyyy") : ""
      }`;
    if (status === "hired")
      return `Đã nhận việc ${
        hiredAt ? format(new Date(hiredAt), "dd/MM/yyyy") : ""
      }`;
    if (status === "interview") return "Đã mời phỏng vấn";
    if (status === "accepted") return "Hồ sơ được chấp nhận";
    if (status === "requested") return "Yêu cầu bổ sung hồ sơ";
    if (status === "reviewing") return "Đang xét duyệt";
    if (status === "submitted") return "Đã nộp hồ sơ";
    return "Chưa nộp hồ sơ";
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-10 px-6">
      {/* Thanh tiến trình */}
      <div className="relative">
        {/* Line nền */}
        <div className="absolute top-10 left-20 right-20 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-out ${
              isRejected
                ? "bg-red-500"
                : "bg-gradient-to-r from-green-500 to-emerald-500"
            }`}
            style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
          />
        </div>

        {/* Các bước */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const stepNum = index + 1;
            const display = getStepDisplay(stepNum);
            const Icon = display.icon;

            return (
              <div key={index} className="flex flex-col items-center z-10">
                <div
                  className={`
                    w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold
                    border-4 border-white shadow-xl transition-all duration-700
                    ${display.bg}
                    ${
                      stepNum === currentStep
                        ? display.ring + " ring-8 scale-110"
                        : ""
                    }
                  `}
                >
                  <Icon className="w-10 h-10" />
                </div>

                <div className="mt-6 text-center w-40">
                  <p className={`font-bold text-lg ${display.labelColor}`}>
                    {step.label}
                  </p>

                  {stepNum === currentStep && (
                    <p className="text-sm font-medium text-gray-700 mt-2">
                      {getStatusText()}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Thông báo đặc biệt */}
      {isRejected && (
        <div className="mt-12 text-center bg-red-50 border-2 border-red-300 rounded-2xl py-6 px-8">
          <Ban className="w-16 h-16 text-red-600 mx-auto mb-3" />
          <p className="text-2xl font-bold text-red-700">Hồ sơ đã bị từ chối</p>
          {rejectedAt && (
            <p className="text-red-600 mt-2">
              Ngày: {format(new Date(rejectedAt), "dd/MM/yyyy HH:mm")}
            </p>
          )}
        </div>
      )}

      {status === "hired" && (
        <div className="mt-12 text-center bg-emerald-50 border-2 border-emerald-400 rounded-2xl py-6 px-8">
          <Award className="w-16 h-16 text-emerald-600 mx-auto mb-3" />
          <p className="text-2xl font-bold text-emerald-700">
            Chúc mừng! Ứng viên đã nhận việc
          </p>
          {hiredAt && (
            <p className="text-emerald-600 mt-2">
              Ngày nhận việc: {format(new Date(hiredAt), "dd/MM/yyyy")}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
