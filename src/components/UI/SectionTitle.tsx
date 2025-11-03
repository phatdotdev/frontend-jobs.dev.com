import React from "react";

interface SectionTitleProps {
  icon: React.ReactNode;
  title: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ icon, title }) => (
  <h3 className="text-lg font-bold text-gray-800 border-b border-teal-100 pb-2 mb-4 flex items-center gap-2">
    <span className="text-xl text-teal-500">{icon}</span>
    {title}
  </h3>
);

export default SectionTitle;
