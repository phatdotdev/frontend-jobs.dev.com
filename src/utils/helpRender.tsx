import { FaFileWord, FaFilePdf, FaFileExcel, FaFileAlt } from "react-icons/fa";
import JobDetailListItem from "../components/Item/JobDetailListItem";
import type { LucideIcon } from "lucide-react";

export const getFileIcon = (file: File) => {
  const type = file.type;
  const name = file.name.toLowerCase();

  if (type === "application/pdf" || name.endsWith(".pdf")) {
    return <FaFilePdf size={24} className="text-red-500" />;
  }
  if (
    type === "application/msword" ||
    type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    name.endsWith(".doc") ||
    name.endsWith(".docx")
  ) {
    return <FaFileWord size={24} className="text-blue-500" />;
  }
  if (
    type === "application/vnd.ms-excel" ||
    type ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    name.endsWith(".xls") ||
    name.endsWith(".xlsx")
  ) {
    return <FaFileExcel size={24} className="text-emerald-600" />;
  }

  return <FaFileAlt size={24} className="text-gray-500" />; // fallback icon
};

export const getFileIconFromName = (filename: string) => {
  const name = filename.toLowerCase();

  if (name.endsWith(".pdf")) {
    return <FaFilePdf size={24} className="text-red-500" />;
  }
  if (name.endsWith(".doc") || name.endsWith(".docx")) {
    return <FaFileWord size={24} className="text-blue-500" />;
  }
  if (name.endsWith(".xls") || name.endsWith(".xlsx")) {
    return <FaFileExcel size={24} className="text-emerald-600" />;
  }

  return <FaFileAlt size={24} className="text-gray-500" />;
};

export const renderContent = (content: string) => {
  const lines = content.split("\n").filter((line) => line.trim());
  if (lines.length <= 1) {
    return (
      <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
        {content}
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {lines?.map((line, i) => (
        <li key={i} className="flex items-start text-gray-700 leading-relaxed">
          <span className="text-teal-600 mr-2">•</span>
          <span>{line.trim()}</span>
        </li>
      ))}
    </ul>
  );
};

export const renderTabContent = (
  content: string,
  Icon: LucideIcon,
  iconClass: string
) => {
  const items = content.split("\n").filter((line) => line.trim().length > 0);

  if (items.length <= 1) {
    return (
      <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
        {content}
      </p>
    );
  }

  return (
    <ul className="space-y-4 pt-4">
      {items.map((item, index) => (
        <JobDetailListItem
          key={index}
          text={item.trim()}
          Icon={Icon}
          iconClassName={iconClass}
        />
      ))}
    </ul>
  );
};
