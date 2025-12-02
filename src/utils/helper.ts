import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function getImageUrl(fileName: string): string {
  const baseUrl = import.meta.env.VITE_API_URL;
  return `${baseUrl}/api/v1/files/${fileName}`;
}

export const timeAgo = (dateString: string): string => {
  const now = new Date();
  const then = new Date(dateString);
  const diffMs = now.getTime() - then.getTime();

  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) return "Vừa xong";
  if (diffMinutes < 60) return `${diffMinutes} phút trước`;
  if (diffHours < 24) return `${diffHours} giờ trước`;
  if (diffDays === 1) return "Hôm qua";
  return `${diffDays} ngày trước`;
};

export const formatCount = (num: number) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  if (num >= 999) return "999+";
  return num.toString();
};

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // tháng bắt đầu từ 0
  const year = date.getFullYear();

  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${hours}:${minutes} | ${day}/${month}/${year}`;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

export const formatTime = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  return isToday
    ? date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
    : date.toLocaleDateString("vi-VN");
};

export const mapGenderToVietnamese = (gender: string | undefined): string => {
  if (!gender) return "Không xác định";

  const normalizedGender = gender.toUpperCase();

  switch (normalizedGender) {
    case "MALE":
      return "Nam";
    case "FEMALE":
      return "Nữ";
    case "OTHER":
      return "Khác";
    default:
      return "Chưa cập nhật";
  }
};
export function mapJobTypeVietnamese(type: string) {
  switch (type) {
    case "FULL_TIME":
      return "Toàn thời gian";
    case "PART_TIME":
      return "Bán thời gian";
    case "INTERNSHIP":
      return "Thực tập";
    case "FREELANCE":
      return "Tự do";
    case "CONTRACT":
      return "Hợp đồng";
    case "TEMPORARY":
      return "Tạm thời";
    case "REMOTE":
      return "Làm việc từ xa";
    default:
      return "Không xác định";
  }
}

export function mapApplicationStateToVi(state: string): string {
  switch (state) {
    case "SUBMITTED":
      return "Mới nộp";
    case "REVIEWING":
      return "Đang xem";
    case "REQUESTED":
      return "Thiếu tài liệu";
    case "ACCEPTED":
      return "Chấp nhận";
    case "REJECTED":
      return "Từ chối";
    default:
      return "Không xác định";
  }
}

export function getApplicationStateNote(state: string): string {
  switch (state) {
    case "SUBMITTED":
      return "Ứng viên đã nộp hồ sơ thành công. Chờ xét duyệt từ nhà tuyển dụng.";
    case "REQUESTED":
      return "Vui lòng bổ sung thêm tài liệu liên quan để hoàn tất hồ sơ ứng tuyển.";
    case "REVIEWING":
      return "Hồ sơ của bạn đang được xem xét. Chúng tôi sẽ phản hồi sớm nhất có thể.";
    case "ACCEPTED":
      return "Chúc mừng! Hồ sơ của bạn đã được chấp nhận. Vui lòng kiểm tra email để biết thêm thông tin.";
    case "REJECTED":
      return "Rất tiếc, hồ sơ của bạn chưa phù hợp với vị trí hiện tại. Cảm ơn bạn đã quan tâm.";
    default:
      return "Trạng thái không xác định.";
  }
}

// Tailwind

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Links

export function getNotificationLink(notification: any) {
  if (notification.resumeId)
    return `/job-seeker/resume/${notification.resumeId}/reviews`;
  else if (notification.applicationId)
    return `/job-seeker/applied-jobs/${notification.applicationId}`;
  else if (notification.postId) return `/jobs/${notification.postId}`;
  return null;
}
