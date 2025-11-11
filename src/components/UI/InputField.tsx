import React from "react";

// Define the properties for the component
interface InputFieldProps {
  label?: string;
  // Icon component type (like Briefcase or Wallet from lucide-react)
  Icon?: React.ComponentType<{ className?: string }>;
  type?: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  rows?: number;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  Icon,
  type = "text",
  value,
  onChange,
  placeholder = "",
  required = false,
  className = "",
  rows = 1,
}) => {
  const hasIcon = !!Icon;

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div
        // Thêm shadow và đảm bảo border khi focus nhất quán
        className={`relative flex items-center border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-teal-500 transition duration-150 shadow-sm ${className}`}
      >
        {/* Icon được căn giữa dọc bằng transform */}
        {hasIcon && (
          <Icon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        )}

        {rows > 1 ? (
          <textarea
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            rows={rows}
            className={`w-full px-4 py-2.5 ${
              // Áp dụng left padding nếu có icon
              hasIcon ? "pl-10" : ""
            } bg-white rounded-lg focus:outline-none placeholder-gray-500 text-sm resize-y text-gray-800`}
          />
        ) : (
          <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className={`w-full px-4 py-2.5 ${
              hasIcon ? "pl-10" : ""
            } bg-white rounded-lg focus:outline-none placeholder-gray-500 text-sm text-gray-800`}
          />
        )}
      </div>
    </div>
  );
};

export default InputField;
