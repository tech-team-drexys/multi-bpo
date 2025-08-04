import React from "react";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  iconBg?: string;
  iconColor?: string;
  delay?: string;
  isVisible?: boolean;
  className?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  description,
  iconBg = "bg-blue-100",
  iconColor = "text-blue-600",
  delay = "",
  isVisible = true,
  className = "",
}) => {
  return (
    <div
      className={`bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 text-center group transition-all duration-300 ${className}`}
    >
      <div className="flex justify-center mb-6">
        <div
          className={`w-16 h-16 ${iconBg} rounded-full flex items-center justify-center group-hover:scale-105 transition-transform duration-300`}
        >
          <Icon className={`w-8 h-8 ${iconColor}`} />
        </div>
      </div>

      <h3 className="text-lg font-bold text-gray-900 mb-4">{title}</h3>

      <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
};

export default FeatureCard;
