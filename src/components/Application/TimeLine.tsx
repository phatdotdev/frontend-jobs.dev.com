import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { getFileIconFromName } from "../../utils/helpRender";
import type { ApplicationDetail } from "../../types/ApplicationProps";
import { getImageUrl } from "../../utils/helper";
import { Bell, Download, Eye, FileText, Paperclip } from "lucide-react";

const Timeline: React.FC<{ application: ApplicationDetail }> = ({
  application,
}) => {
  const notifications = application.notifications;
  const documents = application.documents;
  const timelineItems = [
    ...notifications.map((n) => ({
      ...n,
      itemType: "notification",
      createdAt: n.timestamp,
    })),
    ...documents.map((d) => ({
      ...d,
      itemType: "document",
      createdAt: d.uploadedAt,
    })),
  ].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
        <Bell className="w-6 h-6 text-purple-600" />
        Hoạt động gần đây
      </h2>

      <div className="relative">
        {/* Đường thẳng dọc với gradient nhẹ */}
        <div className="absolute left-9 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-300 via-gray-300 to-transparent"></div>

        <div className="space-y-10">
          {timelineItems.map((item, index) => {
            const isDocument = item.itemType === "document";
            const isLast = index === timelineItems.length - 1;

            return (
              <div
                key={item.id}
                className="relative flex gap-6 animate-in slide-in-from-left-4 duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Icon + Dot */}
                <div className="flex flex-col items-center">
                  <div
                    className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all ${
                      isDocument
                        ? "bg-blue-100 ring-4 ring-blue-100"
                        : "bg-purple-100 ring-4 ring-purple-100"
                    }`}
                  >
                    {isDocument ? (
                      <FileText className="w-5 h-5 text-blue-600" />
                    ) : (
                      <Bell className="w-5 h-5 text-purple-600" />
                    )}
                  </div>
                  {!isLast && (
                    <div className="w-0.5 flex-1 bg-gray-200 mt-2"></div>
                  )}
                </div>

                {/* Content Card */}
                <div
                  className={`flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow ${
                    isDocument ? "max-w-lg" : ""
                  }`}
                >
                  {/* Header: Loại + Thời gian */}
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                        isDocument
                          ? "bg-blue-50 text-blue-700"
                          : "bg-purple-50 text-purple-700"
                      }`}
                    >
                      {isDocument ? (
                        <>
                          <Paperclip className="w-3.5 h-3.5" />
                          Tài liệu
                        </>
                      ) : (
                        <>
                          <Bell className="w-3.5 h-3.5" />
                          Thông báo
                        </>
                      )}
                    </span>
                    <span className="text-xs text-gray-500 font-medium">
                      {format(
                        new Date(item.createdAt),
                        "dd/MM/yyyy 'lúc' HH:mm",
                        {
                          locale: vi,
                        }
                      )}
                    </span>
                  </div>

                  {/* Nội dung */}
                  {isDocument ? (
                    <div className="flex items-center justify-between gap-4 p-3 bg-gray-50 rounded-xl border border-gray-200">
                      <a
                        href={getImageUrl(item.fileName!)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors group flex-1 min-w-0"
                      >
                        <div className="flex-shrink-0">
                          {getFileIconFromName(item.originalName!)}
                        </div>
                        <span className="font-medium truncate">
                          {item.originalName}
                        </span>
                      </a>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded border">
                          {item.fileType?.includes("pdf")
                            ? "PDF"
                            : item.fileType?.includes("word")
                            ? "Word"
                            : "Excel"}
                        </span>
                        <a
                          href={getImageUrl(item.fileName!)}
                          download
                          className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                          title="Tải xuống"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                        <a
                          href={getImageUrl(item.fileName!)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                          title="Xem trước"
                        >
                          <Eye className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <h4 className="font-bold text-gray-900">{item.title}</h4>
                      {item.content && (
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {item.content}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Nếu không có hoạt động */}
      {timelineItems.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bell className="w-10 h-10 text-gray-400" />
          </div>
          <p className="text-gray-500 font-medium">Chưa có hoạt động nào</p>
        </div>
      )}
    </div>
  );
};

export default Timeline;
