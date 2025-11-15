import type { LucideIcon } from "lucide-react";

interface JobDetailListItemProps {
  text: string;
  Icon: LucideIcon;
  iconClassName: string;
}

const JobDetailListItem: React.FC<JobDetailListItemProps> = ({
  text,
  Icon,
  iconClassName,
}) => (
  <li className="flex items-start text-gray-700 leading-relaxed">
    <Icon size={18} className={`flex-shrink-0 mt-1 mr-3 ${iconClassName}`} />
    <span className="text-base">{text}</span>
  </li>
);

export default JobDetailListItem;
