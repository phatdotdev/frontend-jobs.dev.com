import React, { type ReactNode } from "react";

interface SelectFieldProps {
  Icon: React.ComponentType<{ className?: string }>;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  placeholder?: string;
  children: ReactNode;
}

const SelectField: React.FC<SelectFieldProps> = ({
  Icon,
  value,
  onChange,
  placeholder = "Chọn...",
  children,
}) => (
  <div className="relative flex items-center border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-teal-500 transition duration-150">
    <Icon className="w-5 h-5 text-gray-400 ml-3 pointer-events-none absolute" />
    <select
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2.5 pl-10 bg-white rounded-lg appearance-none cursor-pointer focus:outline-none text-sm border-0"
    >
      <option value="" disabled hidden>
        {placeholder}
      </option>
      {children}
    </select>
    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
      ▼
    </span>
  </div>
);

export default SelectField;
