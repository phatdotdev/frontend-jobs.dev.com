import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

// Định nghĩa type cho application (dựa trên dữ liệu bạn gửi)
interface Application {
  resume: {
    firstname: string;
    lastname: string;
    dob: string; // "2004-12-09"
    phone: string;
    email: string;
  };
  state: "HIRED" | "REJECTED" | "REVIEWING" | "REQUESTED" | string;
  // các field khác nếu cần...
}

// Hàm chính bạn sẽ gọi
export const exportApplicationsToExcel = async (
  applications: Application[],
  fileName?: string
) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Danh sách ứng tuyển", {
    pageSetup: { paperSize: 9, orientation: "landscape" },
  });

  // === Header ===
  const headerRow = sheet.addRow([
    "STT",
    "Họ và tên",
    "Ngày sinh",
    "Số điện thoại",
    "Email",
    "Trạng thái hệ thống",
    "Kết quả xét tuyển",
  ]);

  // Style header
  headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
  headerRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF1f4e79" }, // xanh đậm
  };
  headerRow.alignment = { vertical: "middle", horizontal: "center" };

  // === Dữ liệu ===
  applications.forEach((app, index) => {
    const dob = new Date(app.resume.dob).toLocaleDateString("vi-VN");

    const ketQua =
      app.state === "HIRED"
        ? "Đã tuyển"
        : app.state === "REJECTED"
        ? "Đã rớt"
        : "Đang xét";

    const row = sheet.addRow([
      index + 1,
      `${app.resume.lastname} ${app.resume.firstname}`.trim(),
      dob,
      app.resume.phone,
      app.resume.email,
      app.state,
      ketQua,
    ]);

    // Tô màu dòng "Đã tuyển" cho dễ nhìn
    if (app.state === "HIRED") {
      row.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFE6F9E6" }, // xanh nhạt
      };
    }
    if (app.state === "REJECTED") {
      row.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFF9E6E6" }, // đỏ nhạt
      };
    }
  });

  // Auto fit cột
  sheet.columns = [
    { width: 8 },
    { width: 22 },
    { width: 14 },
    { width: 16 },
    { width: 28 },
    { width: 20 },
    { width: 18 },
  ];

  // === Xuất file ===
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const defaultFileName = `Danh_sach_ung_tuyen_${new Date()
    .toLocaleDateString("vi-VN")
    .replace(/\//g, "-")}.xlsx`;

  saveAs(blob, fileName || defaultFileName);
};
