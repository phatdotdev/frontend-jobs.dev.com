import { AlertTriangle } from "lucide-react";

type ErrorAlertProps = {
  content?: string;
};

const ErrorAlert = ({ content }: ErrorAlertProps) => {
  return (
    <div className="flex items-center justify-center h-20 bg-red-50 shadow-md">
      <AlertTriangle className="h-6 w-6 text-red-500 mr-2" />
      <p className="text-red-600 font-medium">
        {content ? content : "Lỗi khi tải dữ liệu!"}
      </p>
    </div>
  );
};

export default ErrorAlert;
