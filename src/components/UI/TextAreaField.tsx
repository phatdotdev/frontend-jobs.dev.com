import React, { type FC, type ChangeEvent } from "react";

interface TextAreaFieldProps {
  name: string;
  placeholder: string;
  Icon: FC<React.SVGProps<SVGSVGElement>>;
  required?: boolean;
  rows?: number;

  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  isLoading: boolean;
}

const TextAreaField: FC<TextAreaFieldProps> = ({
  name,
  placeholder,
  Icon,
  required = false,
  rows = 4,
  value,
  onChange,
  isLoading,
}) => (
  <div className="relative mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
      <Icon className="w-4 h-4 mr-2 text-teal-600" />
      {placeholder} {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <textarea
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      rows={rows}
      className="border border-gray-300 p-3 text-sm rounded-lg w-full focus:ring-teal-500 focus:border-teal-500 transition duration-150"
      disabled={isLoading}
    />
  </div>
);

export default TextAreaField;
