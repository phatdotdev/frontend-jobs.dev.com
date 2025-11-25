// utils/getResumeDocument.ts - PHIÊN BẢN CUỐI CÙNG SIÊU ĐẸP 2025 - Adjusted to match professional sample layout
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  ImageRun,
  VerticalAlign,
} from "docx";
import type { ResumeProps } from "../types/ResumeProps";

// Constants
const BORDER_NONE = {
  top: { style: BorderStyle.NONE },
  bottom: { style: BorderStyle.NONE },
  left: { style: BorderStyle.NONE },
  right: { style: BorderStyle.NONE },
};

const ACCENT = "000000"; // Black for professional look
const DARK = "000000";
const GRAY = "808080";
const FONT_FAMILY = "Arial"; // Font chuyên nghiệp, dễ đọc, ATS-friendly

// Helper functions
const formatDate = (date?: string | null) => {
  if (!date) return "Hiện tại";
  const d = new Date(date);
  return `${("0" + (d.getMonth() + 1)).slice(-2)}/${d.getFullYear()}`;
};

const formatFullDate = (date?: string | null) => {
  if (!date) return "Không công khai";
  return new Date(date).toLocaleDateString("vi-VN");
};

function infoParagraph(label: string, value: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text: `${label}: `,
        size: 24,
        bold: true,
        color: GRAY,
        font: FONT_FAMILY,
      }),
      new TextRun({
        text: value,
        size: 24,
        color: DARK,
        font: FONT_FAMILY,
      }),
    ],
    spacing: { after: 100 },
  });
}

function skillCell(name?: string, level?: string): TableCell {
  if (!name)
    return new TableCell({
      children: [new Paragraph({})],
      borders: BORDER_NONE,
    });
  return new TableCell({
    width: { size: 33, type: WidthType.PERCENTAGE },
    borders: BORDER_NONE,
    children: [
      new Paragraph({
        children: [
          new TextRun({ text: "- ", color: DARK, size: 28 }),
          new TextRun({ text: name, size: 24, color: DARK, font: FONT_FAMILY }),
          level
            ? new TextRun({
                text: ` (${level})`,
                size: 23,
                color: DARK,
                bold: true,
                font: FONT_FAMILY,
              })
            : new TextRun(""),
        ],
      }),
    ],
  });
}

export async function generateResumeFile(
  resume: ResumeProps,
  profileImage?: File | string
): Promise<File> {
  const fullName =
    `${resume.firstname || ""} ${resume.lastname || ""}`.trim() || "ỨNG VIÊN";
  const position = resume.title || "Lập trình viên";

  const children: (Paragraph | Table)[] = [];

  // ==================== HEADER ====================
  let imageData: ArrayBuffer | null = null;
  if (profileImage) {
    try {
      if (typeof profileImage === "string") {
        const res = await fetch(profileImage);
        if (res.ok) imageData = await res.arrayBuffer();
      } else {
        imageData = await (profileImage as File).arrayBuffer();
      }
    } catch (e) {
      console.error("Lỗi tải ảnh:", e);
    }
  }

  const headerTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: BORDER_NONE,
    rows: [
      new TableRow({
        children: [
          // Cột ảnh
          new TableCell({
            width: { size: 25, type: WidthType.PERCENTAGE },
            borders: BORDER_NONE,
            verticalAlign: VerticalAlign.CENTER,
            children: imageData
              ? [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new ImageRun({
                        data: imageData,
                        transformation: { width: 145, height: 145 },
                      }),
                    ],
                  }),
                ]
              : [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new TextRun({
                        text: "Ảnh 3x4",
                        size: 80,
                        bold: true,
                        color: DARK,
                        font: FONT_FAMILY,
                      }),
                    ],
                  }),
                ],
          }),
          // Cột thông tin
          new TableCell({
            width: { size: 75, type: WidthType.PERCENTAGE },
            borders: BORDER_NONE,
            verticalAlign: VerticalAlign.TOP,
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: fullName,
                    size: 68,
                    bold: true,
                    color: DARK,
                    font: FONT_FAMILY,
                  }),
                ],
                spacing: { after: 150 },
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: position,
                    size: 44,
                    bold: true,
                    color: DARK,
                    font: FONT_FAMILY,
                  }),
                ],
                spacing: { after: 400 },
              }),
              // Thông tin liên hệ - vertical list
              infoParagraph(
                "Ngày sinh",
                resume.dob ? formatFullDate(resume.dob) : "Không công khai"
              ),
              infoParagraph("Giới tính", "Nam"), // Hardcoded to match sample; adjust if prop added
              infoParagraph("Số điện thoại", resume.phone || "N/A"),
              infoParagraph("Email", resume.email || "N/A"),
              infoParagraph("Website", "linkedin.com/in/profile"), // Hardcoded to match sample
              infoParagraph("Địa chỉ", resume.address || "TP. Cần Thơ"),
            ],
          }),
        ],
      }),
    ],
  });

  children.push(headerTable);

  // ==================== CÁC PHẦN NỘI DUNG ====================
  const addSection = (title: string, content: (Paragraph | Table)[]) => {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: title.toUpperCase(),
            size: 32,
            bold: true,
            color: DARK,
            font: FONT_FAMILY,
          }),
        ],
        spacing: { before: 600, after: 300 },
        alignment: AlignmentType.LEFT,
      }),
      ...content,
      new Paragraph({ spacing: { after: 400 } })
    );
  };

  // Mục tiêu
  if (resume.objectCareer?.trim()) {
    addSection("MỤC TIÊU NGHỀ NGHIỆP", [
      new Paragraph({
        children: [
          new TextRun({
            text: resume.objectCareer.trim(),
            size: 24,
            color: DARK,
            font: FONT_FAMILY,
          }),
        ],
        spacing: { after: 300, line: 360 },
      }),
    ]);
  }

  // Giới thiệu (if separate from objective)
  if (
    resume.introduction?.trim() &&
    resume.introduction !== resume.objectCareer
  ) {
    addSection("GIỚI THIỆU BẢN THÂN", [
      new Paragraph({
        children: [
          new TextRun({
            text: resume.introduction.trim(),
            size: 24,
            color: DARK,
            font: FONT_FAMILY,
          }),
        ],
        spacing: { after: 300, line: 360 },
      }),
    ]);
  }

  // Học vấn
  if (resume.educations?.length) {
    const eduContent: (Paragraph | Table)[] = [];
    resume.educations.forEach((edu) => {
      eduContent.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${formatDate(edu.startDate)} - ${formatDate(
                edu.endDate
              )} `,
              size: 24,
              bold: true,
              color: DARK,
              font: FONT_FAMILY,
            }),
            new TextRun({
              text: edu.schoolName,
              size: 24,
              bold: true,
              color: DARK,
              font: FONT_FAMILY,
            }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `Chuyên ngành: ${edu.major}`,
              size: 24,
              color: DARK,
              font: FONT_FAMILY,
            }),
          ],
          spacing: { after: 150 },
        })
      );

      if (edu.grade) {
        eduContent.push(
          new Paragraph({
            children: [
              new TextRun({ text: "- ", color: DARK, size: 26 }),
              new TextRun({
                text: `Xếp loại: Xuất sắc - GPA: ${edu.grade}/4.0`,
                size: 23,
                color: DARK,
                font: FONT_FAMILY,
              }),
            ],
            spacing: { after: 100 },
          })
        );
      }

      if (edu.description?.trim()) {
        edu.description
          .split("\n")
          .filter(Boolean)
          .forEach((line) => {
            eduContent.push(
              new Paragraph({
                children: [
                  new TextRun({ text: "- ", color: DARK, size: 26 }),
                  new TextRun({
                    text: line.trim(),
                    size: 23,
                    color: DARK,
                    font: FONT_FAMILY,
                  }),
                ],
                spacing: { after: 100 },
              })
            );
          });
      }

      eduContent.push(new Paragraph({ spacing: { after: 300 } }));
    });
    addSection("HỌC VẤN", eduContent);
  }

  // Kinh nghiệm
  if (resume.experiences?.length) {
    const expContent: (Paragraph | Table)[] = [];
    resume.experiences.forEach((exp) => {
      expContent.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${formatDate(exp.startDate)} - ${formatDate(
                exp.endDate
              )} `,
              size: 24,
              bold: true,
              color: DARK,
              font: FONT_FAMILY,
            }),
            new TextRun({
              text: exp.companyName,
              size: 24,
              bold: true,
              color: DARK,
              font: FONT_FAMILY,
            }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: exp.position || "Chức vụ",
              bold: true,
              size: 24,
              color: DARK,
              font: FONT_FAMILY,
            }),
          ],
          spacing: { after: 150 },
        })
      );

      if (exp.description) {
        exp.description
          .split("\n")
          .filter(Boolean)
          .forEach((line) => {
            expContent.push(
              new Paragraph({
                children: [
                  new TextRun({ text: "- ", color: DARK, size: 26 }),
                  new TextRun({
                    text: line.trim(),
                    size: 23,
                    color: DARK,
                    font: FONT_FAMILY,
                  }),
                ],
                spacing: { after: 100 },
              })
            );
          });
      }

      expContent.push(new Paragraph({ spacing: { after: 300 } }));
    });
    addSection("KINH NGHIỆM LÀM VIỆC", expContent);
  }

  // Kỹ năng
  if (resume.skills?.length) {
    const skillRows: TableRow[] = [];
    for (let i = 0; i < resume.skills.length; i += 3) {
      const s1 = resume.skills[i];
      const s2 = resume.skills[i + 1];
      const s3 = resume.skills[i + 2];
      skillRows.push(
        new TableRow({
          children: [
            skillCell(s1?.name, s1?.level),
            skillCell(s2?.name, s2?.level),
            skillCell(s3?.name, s3?.level),
          ],
        })
      );
    }

    const skillContent: (Table | Paragraph)[] = [
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: BORDER_NONE,
        rows: skillRows,
      }),
    ];

    // Thêm description cho từng skill nếu có
    resume.skills.forEach((skill) => {
      if (skill.description?.trim()) {
        skillContent.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${skill.name}: `,
                bold: true,
                size: 22,
                color: DARK,
                font: FONT_FAMILY,
              }),
              new TextRun({
                text: skill.description.trim(),
                size: 22,
                color: DARK,
                italics: true,
                font: FONT_FAMILY,
              }),
            ],
            spacing: { after: 150 },
          })
        );
      }
    });

    addSection("KỸ NĂNG CHUYÊN MÔN", skillContent);
  }

  // Dự án
  if (resume.projects?.length) {
    const projContent: Paragraph[] = [];
    resume.projects.forEach((p) => {
      projContent.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `- ${p.name}`,
              bold: true,
              size: 26,
              color: DARK,
              font: FONT_FAMILY,
            }),
          ],
        })
      );

      if (p.role) {
        projContent.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `Vai trò: ${p.role}`,
                size: 22,
                color: GRAY,
                italics: true,
                font: FONT_FAMILY,
              }),
            ],
          })
        );
      }

      if (p.description) {
        projContent.push(
          new Paragraph({
            children: [
              new TextRun({
                text: p.description,
                size: 22,
                color: DARK,
                font: FONT_FAMILY,
              }),
            ],
          })
        );
      }

      if (p.projectUrl) {
        projContent.push(
          new Paragraph({
            children: [
              new TextRun({
                text: "Link: ",
                bold: true,
                size: 22,
                font: FONT_FAMILY,
              }),
              new TextRun({
                text: p.projectUrl,
                size: 22,
                color: "0000EE",
                underline: {},
                font: FONT_FAMILY,
              }),
            ],
          })
        );
      }

      if (p.result?.trim()) {
        projContent.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `Kết quả: ${p.result.trim()}`,
                size: 22,
                color: DARK,
                bold: true,
                font: FONT_FAMILY,
              }),
            ],
          })
        );
      }

      projContent.push(new Paragraph({ spacing: { after: 200 } }));
    });
    addSection("DỰ ÁN NỔI BẬT", projContent);
  }

  // Chứng chỉ & Giải thưởng
  if ((resume.certifications?.length || 0) + (resume.awards?.length || 0) > 0) {
    const certContent: Paragraph[] = [];
    [...(resume.certifications || []), ...(resume.awards || [])].forEach(
      (item) => {
        certContent.push(
          new Paragraph({
            children: [
              new TextRun({ text: "- ", color: DARK }),
              new TextRun({
                text: item.name,
                bold: true,
                size: 24,
                color: DARK,
                font: FONT_FAMILY,
              }),
              "issuer" in item && item.issuer
                ? new TextRun({
                    text: ` - ${item.issuer}`,
                    size: 23,
                    color: GRAY,
                    font: FONT_FAMILY,
                  })
                : new TextRun(""),
              "achievement" in item && item.achievement
                ? new TextRun({
                    text: ` (${item.achievement})`,
                    size: 23,
                    color: DARK,
                    bold: true,
                    font: FONT_FAMILY,
                  })
                : new TextRun(""),
            ],
            spacing: { after: 100 },
          })
        );
      }
    );
    addSection("CHỨNG CHỈ & GIẢI THƯỞNG", certContent);
  }

  // Hoạt động
  if (resume.activities?.length) {
    const actContent: Paragraph[] = [];
    resume.activities.forEach((a) => {
      actContent.push(
        new Paragraph({
          children: [
            new TextRun({ text: "- ", color: DARK }),
            new TextRun({
              text: a.name,
              bold: true,
              size: 24,
              font: FONT_FAMILY,
            }),
            a.role
              ? new TextRun({
                  text: ` - ${a.role}`,
                  size: 23,
                  color: GRAY,
                  italics: true,
                  font: FONT_FAMILY,
                })
              : new TextRun(""),
          ],
          spacing: { after: 100 },
        })
      );
      if (a.description?.trim()) {
        actContent.push(
          new Paragraph({
            children: [
              new TextRun({
                text: a.description.trim(),
                size: 22,
                color: DARK,
                font: FONT_FAMILY,
              }),
            ],
          })
        );
      }
      actContent.push(new Paragraph({ spacing: { after: 200 } }));
    });
    addSection("HOẠT ĐỘNG", actContent); // Adjusted title to match sample
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 800, bottom: 800, left: 900, right: 900 },
          },
        },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const fileName = `${(resume.title || "CV")
    .replace(/[^\w\s\u00C0-\u1EF9]/g, "")
    .trim()}_${resume.lastname || "UngVien"}.docx`.replace(/\s+/g, "_");

  return new File([blob], fileName, {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });
}
