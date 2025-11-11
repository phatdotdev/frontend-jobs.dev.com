import { useState } from "react";
import {
  X,
  Calendar,
  MessageSquare,
  Loader2,
  Send,
  HeartPlus,
} from "lucide-react";
import dayjs from "dayjs";

type FeedbackRequestModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (notes: string, completedAt: string) => void;
  isLoading: boolean;
};

const FeedbackRequestModal: React.FC<FeedbackRequestModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}) => {
  const [notes, setNotes] = useState("");
  const [completedAt, setCompletedAt] = useState(
    dayjs().add(1, "day").format("YYYY-MM-DDTHH:mm")
  );

  if (!isOpen) return null;

  const maxDate = dayjs().add(3, "day").format("YYYY-MM-DDTHH:mm");
  const minDate = dayjs().format("YYYY-MM-DDTHH:mm");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      dayjs(completedAt).isBefore(dayjs()) ||
      dayjs(completedAt).isAfter(dayjs().add(3, "day"))
    ) {
      alert("Thời điểm hoàn thành phải nằm trong vòng 3 ngày kể từ bây giờ.");
      return;
    }

    onSubmit(notes, completedAt);
  };

  return (
    // Backdrop
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 p-6 transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-2xl font-bold text-indigo-600 flex items-center gap-2">
            <HeartPlus className="w-6 h-6" /> Yêu cầu Đánh giá Hồ sơ
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Trường Ghi chú (Notes) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <MessageSquare className="w-4 h-4 mr-1 text-gray-500" /> Ghi chú
              (Notes)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              placeholder="Ví dụ: Vui lòng tập trung vào phần kinh nghiệm làm việc và kỹ năng kỹ thuật."
            />
          </div>

          {/* Trường Thời điểm Hoàn thành */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <Calendar className="w-4 h-4 mr-1 text-gray-500" /> Thời điểm Hoàn
              thành (Tối đa 3 ngày)
            </label>
            <input
              type="datetime-local"
              value={completedAt}
              onChange={(e) => setCompletedAt(e.target.value)}
              min={minDate.substring(0, 16)} // Chỉ lấy phần datetime-local
              max={maxDate.substring(0, 16)} // Chỉ lấy phần datetime-local
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">
              Thời gian yêu cầu tối đa là 72 giờ (3 ngày) kể từ bây giờ.
            </p>
          </div>

          {/* Nút Gửi */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-indigo-500/30"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
            {isLoading ? "Đang gửi yêu cầu..." : "Gửi Yêu cầu Đánh giá"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FeedbackRequestModal;
