import React from "react";

interface InputFieldProps {
  label?: string;
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
        <label className="block text-sm font-semibold text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div
        className={`relative flex items-center border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-teal-500 transition duration-150 ${className}`}
      >
        {hasIcon && (
          <Icon className="w-5 h-5 text-gray-400 ml-3 absolute left-3" />
        )}

        {rows > 1 ? (
          <textarea
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            rows={rows}
            className={`w-full px-4 py-2.5 ${
              hasIcon ? "pl-10" : ""
            } bg-white rounded-lg focus:outline-none placeholder-gray-500 text-sm resize-none`}
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
            } bg-white rounded-lg focus:outline-none placeholder-gray-500 text-sm`}
          />
        )}
      </div>
    </div>
  );
};

export default InputField;
