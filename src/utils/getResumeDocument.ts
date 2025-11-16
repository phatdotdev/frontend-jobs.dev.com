import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
} from "docx";

export async function generateResumeFile(resume, files) {
  const p = (text, opts = {}) => new Paragraph({ text, ...opts });

  const doc = new Document({
    sections: [
      {
        children: [
          p(resume.name, {
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
          }),
          p(resume.position, { alignment: AlignmentType.CENTER }),
          p("", {}),

          p("THÔNG TIN LIÊN HỆ", { heading: HeadingLevel.HEADING_2 }),
          p(`📧 Email: ${resume.contact.email}`),
          p(`📞 SĐT: ${resume.contact.phone}`),
          p(`🏠 Địa chỉ: ${resume.contact.address}`),
          p("", {}),

          p("HỌC VẤN", { heading: HeadingLevel.HEADING_2 }),
          ...resume.education.map(
            (edu) =>
              new Paragraph({
                children: [
                  new TextRun({ text: edu.school, bold: true }),
                  new TextRun(`\n${edu.major} (${edu.year})`),
                ],
              })
          ),
          p("", {}),

          p("KINH NGHIỆM LÀM VIỆC", { heading: HeadingLevel.HEADING_2 }),
          ...resume.experience.flatMap((exp) => [
            new Paragraph({
              children: [
                new TextRun({
                  text: `${exp.company} – ${exp.position}`,
                  bold: true,
                }),
                new TextRun(` (${exp.period})`),
              ],
            }),
            ...exp.details.map((d) => p(`- ${d}`)),
            p("", {}),
          ]),

          p("KỸ NĂNG", { heading: HeadingLevel.HEADING_2 }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: resume.skills.map(
              (skill) =>
                new TableRow({
                  children: [new TableCell({ children: [p(skill)] })],
                })
            ),
          }),
          p("", {}),

          p("MỤC TIÊU NGHỀ NGHIỆP", { heading: HeadingLevel.HEADING_2 }),
          p(resume.goals),
          p("", {}),

          p("Người làm hồ sơ", { alignment: AlignmentType.RIGHT }),
          p(resume.name, { alignment: AlignmentType.RIGHT }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);

  const file = new File(
    [blob],
    `${resume.name.replace(/\s+/g, "_")}_Resume.docx`,
    {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    }
  );

  files.push(file);

  return file; // optional, nếu bạn muốn lấy luôn file sau khi tạo
}
