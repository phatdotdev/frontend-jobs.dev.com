import React, { type FC, type ChangeEvent } from "react";
import type { ResumeFormProps } from "../../types/ResumeProps";

interface Option {
  id: string;
  name: string;
}

interface CheckboxGroupFieldProps {
  fieldName: string;
  label: string;
  Icon: FC<React.SVGProps<SVGSVGElement>>;
  options: Option[];

  formState: Record<string, any>;
  handleCheckboxChange: (
    e: ChangeEvent<HTMLInputElement>,
    fieldName: keyof ResumeFormProps
  ) => void;
  isLoading: boolean;
}

const CheckboxGroupField: FC<CheckboxGroupFieldProps> = ({
  fieldName,
  label,
  Icon,
  options,
  formState,
  handleCheckboxChange,
  isLoading,
}) => {
  const currentValues = (formState[fieldName] || []) as string[];

  return (
    <div className="mb-4 p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
      <label className="block text-sm font-bold text-gray-800 mb-2 flex items-center border-b pb-2">
        <Icon className="w-4 h-4 mr-2 text-teal-600" />
        {label}
      </label>
      <div className="space-y-1">
        {options.map((item) => (
          <div key={item.id} className="flex items-center">
            <input
              type="checkbox"
              id={`${fieldName}-${item.id}`}
              name={fieldName}
              value={item.id}
              checked={currentValues.includes(item.id)}
              onChange={(e) =>
                handleCheckboxChange(e, fieldName as keyof ResumeFormProps)
              }
              className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
              disabled={isLoading}
            />
            <label
              htmlFor={`${fieldName}-${item.id}`}
              className="ml-2 text-sm text-gray-700 cursor-pointer hover:text-teal-700"
            >
              {item.name}
            </label>
          </div>
        ))}
        {options.length === 0 && (
          <p className="text-xs text-gray-400 italic">
            Chưa có mục nào được tạo.
          </p>
        )}
      </div>
    </div>
  );
};

export default CheckboxGroupField;
