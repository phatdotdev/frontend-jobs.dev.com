import { TrendingUp } from "lucide-react";

const SelectWithIcon = ({
  Icon,
  name,
  value,
  onChange,
  options,
  required = false,
}: {
  Icon: React.ElementType;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  required?: boolean;
}) => (
  <div className="relative">
    <Icon className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
    <select
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-1 focus:ring-teal-500 focus:border-teal-500 text-sm"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

export default SelectWithIcon;
