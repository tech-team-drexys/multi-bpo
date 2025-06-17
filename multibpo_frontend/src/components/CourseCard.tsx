import { ArrowRight } from "lucide-react";
import { components, borderRadius, shadows } from "@/lib/design-system";

interface CourseCardProps {
  image: string;
  tag: string;
  subtitle: string;
  title: string;
  linkText: string;
}

const CourseCard = ({
  image,
  tag,
  subtitle,
  title,
  linkText,
}: CourseCardProps) => {
  return (
    <div className="group cursor-pointer transition-transform duration-300">
      <div
        className={`relative overflow-hidden ${borderRadius.md} mb-4 ${shadows.md}`}
      >
        <img
          src={image}
          alt={title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4">
          <span
            className={`bg-blue-100 text-blue-600 px-3 py-1 ${borderRadius.sm} text-sm font-medium`}
          >
            {tag}
          </span>
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-gray-600 text-sm font-medium">{subtitle}</p>
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        <div className={components.button.default}>
          <span className="transition-transform duration-200">{linkText}</span>
          <ArrowRight className={components.button.defaultArrow} />
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
