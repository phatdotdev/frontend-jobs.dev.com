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
  XCircle,
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
    | "REJECTED"
    | "CANCELLED";
  appliedAt?: string | null;
  requestedAt?: string | null;
  acceptedAt?: string | null;
  interviewAt?: string | null;
  hiredAt?: string | null;
  rejectedAt?: string | null;
  cancelledAt?: string | null;
  updatedAt?: string;
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
    cancelledAt,
    updatedAt,
  } = app;

  // Xác định tiến trình
  const getProgress = () => {
    const isRejected = state === "REJECTED" || !!rejectedAt;
    const isCancelled = state === "CANCELLED" || !!cancelledAt;
    const isTerminated = isRejected || isCancelled;

    if (isTerminated) {
      if (acceptedAt || interviewAt || hiredAt) {
        return {
          currentStep: 4,
          terminatedAtStep: 4,
          isCancelled,
          isTerminated: true,
        };
      }
      return {
        currentStep: 2,
        terminatedAtStep: 2,
        isCancelled,
        isTerminated: true,
      };
    }

    if (state === "HIRED" || hiredAt)
      return { currentStep: 4, status: "hired" };
    if (state === "INTERVIEW" || interviewAt)
      return { currentStep: 3, status: "interview" };
    if (state === "ACCEPTED" || acceptedAt)
      return { currentStep: 3, status: "accepted" };
    if (state === "REQUESTED" || requestedAt)
      return { currentStep: 2, status: "requested" };
    if (state === "REVIEW" || state === "REVIEWING")
      return { currentStep: 2, status: "reviewing" };
    if (state === "SUBMITTED" || appliedAt)
      return { currentStep: 1, status: "submitted" };

    return { currentStep: 1, status: "pending" };
  };

  const {
    currentStep,
    terminatedAtStep,
    isTerminated = false,
    isCancelled = false,
    status = "pending",
  } = getProgress();

  const statusConfig = {
    submitted: { color: "bg-green-500", ring: "ring-green-200", icon: Check },
    reviewing: { color: "bg-amber-500", ring: "ring-amber-200", icon: Clock },
    requested: {
      color: "bg-purple-500",
      ring: "ring-purple-200",
      icon: AlertCircle,
    },
    accepted: { color: "bg-blue-500", ring: "ring-blue-200", icon: Check },
    interview: { color: "bg-indigo-500", ring: "ring-indigo-200", icon: Users },
    hired: { color: "bg-emerald-600", ring: "ring-emerald-300", icon: Award },
  };

  const getStepStyle = (stepIndex: number) => {
    const isPast = stepIndex < currentStep;
    const isCurrent = stepIndex === currentStep;
    const isFuture = stepIndex > currentStep;

    // 1. Bước bị hủy/từ chối → chỉ tô đỏ những bước ĐÃ QUA + bước hiện tại (nơi dừng lại)
    if (isTerminated && stepIndex <= terminatedAtStep!) {
      if (stepIndex < terminatedAtStep!) {
        // Các bước đã hoàn thành trước khi bị hủy → vẫn xanh (đã làm xong mà)
        return {
          bg: "bg-green-500 text-white",
          ring: "ring-green-200",
          icon: Check,
          labelColor: "text-gray-800",
        };
      } else {
        // Bước hiện tại (nơi bị hủy/rớt) → đỏ + X
        return {
          bg: "bg-red-600 text-white",
          ring: "ring-red-300",
          icon: X,
          labelColor: "text-red-600",
        };
      }
    }

    // 2. Trường hợp bình thường (không bị hủy)
    if (isPast) {
      return {
        bg: "bg-green-500 text-white",
        ring: "ring-green-200",
        icon: Check,
        labelColor: "text-gray-800",
      };
    }

    if (isCurrent) {
      if (status === "hired") {
        return {
          bg: "bg-emerald-600 text-white",
          ring: "ring-emerald-300",
          icon: Award,
          labelColor: "text-emerald-700",
        };
      }
      const cfg =
        statusConfig[status as keyof typeof statusConfig] ||
        statusConfig.submitted;
      return {
        bg: cfg.color + " text-white",
        ring: cfg.ring,
        icon: cfg.icon,
        labelColor: "text-gray-900",
      };
    }

    // 3. Tương lai → luôn xám (dù bị hủy hay không)
    return {
      bg: "bg-gray-300 text-gray-600",
      ring: "ring-gray-200",
      icon: steps[stepIndex - 1].defaultIcon,
      labelColor: "text-gray-500",
    };
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-10 px-6">
      {/* Thanh tiến trình */}
      <div className="relative">
        {/* Đường nền + thanh màu */}
        <div className="absolute top-10 left-20 right-20 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-out ${
              isTerminated && currentStep === terminatedAtStep
                ? "bg-red-500"
                : "bg-gradient-to-r from-green-500 to-emerald-500"
            }`}
            style={{
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
            }}
          />
        </div>

        {/* Các bước */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const stepNum = index + 1;
            const style = getStepStyle(stepNum);
            const Icon = style.icon;

            return (
              <div key={index} className="flex flex-col items-center z-10">
                <div
                  className={`
                    w-20 h-20 rounded-full flex items-center justify-center shadow-xl
                    border-4 border-white transition-all duration-700
                    ${style.bg}
                    ${
                      stepNum === currentStep
                        ? "ring-8 " + style.ring + " scale-110"
                        : ""
                    }
                  `}
                >
                  <Icon className="w-10 h-10" />
                </div>

                <div className="mt-6 text-center w-40">
                  <p className={`font-bold text-lg ${style.labelColor}`}>
                    {step.label}
                  </p>
                  {stepNum === currentStep && (
                    <p className="text-sm font-medium text-gray-700 mt-2">
                      {isTerminated
                        ? isCancelled
                          ? "Đơn đã bị hủy"
                          : "Bị từ chối"
                        : status === "hired"
                        ? "Đã nhận việc"
                        : status === "interview"
                        ? "Đang phỏng vấn"
                        : "Đang xử lý"}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Thông báo cuối */}
      {isTerminated && (
        <div className="mt-6 text-center bg-red-50 border-2 border-red-300 rounded-3xl py-4 px-10 shadow-lg">
          {isCancelled ? (
            <>
              <div>
                <Ban className="w-20 h-20 text-red-600 mx-auto mb-4" />
                <p className="text-xl font-bold text-red-700">
                  Đơn ứng tuyển đã được hủy
                </p>
              </div>
              <p className="text-red-600 mt-3 text-lg">
                Ứng viên đã chủ động hủy đơn vào ngày{" "}
                <span className="font-bold">
                  {format(
                    new Date(cancelledAt || updatedAt || Date.now()),
                    "dd/MM/yyyy 'lúc' HH:mm"
                  )}
                </span>
              </p>
            </>
          ) : (
            <>
              <XCircle className="w-20 h-20 text-red-600 mx-auto mb-4" />
              <p className="text-xl font-bold text-red-700">
                Hồ sơ đã bị từ chối
              </p>
            </>
          )}
        </div>
      )}

      {status === "hired" && (
        <div className="mt-6 text-center bg-emerald-50 border-2 border-emerald-400 rounded-3xl py-4 px-10 shadow-lg">
          <Award className="w-20 h-20 text-emerald-600 mx-auto mb-4" />
          <p className="text-xl font-bold text-emerald-700">
            Chúc mừng! Bạn đã được nhận việc
          </p>
        </div>
      )}
    </div>
  );
}
