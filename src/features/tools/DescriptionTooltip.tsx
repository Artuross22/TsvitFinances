"use client";

import { Eye } from "lucide-react";

interface DescriptionTooltipProps {
  description: string | undefined;
}

const DescriptionTooltip = ({ description }: DescriptionTooltipProps) => {
  return (
    <div className="relative group">
      <div className="flex items-center gap-2">
        <p className="text-gray-600 truncate flex-1">{description}</p>
        <Eye className="w-5 h-5 text-gray-500 hover:text-gray-700 cursor-pointer" />
      </div>

      <div className="absolute hidden group-hover:block z-50 right-0 top-full mt-2 bg-white p-4 rounded-lg shadow-lg border w-full max-w-lg">
        <p className="text-gray-600 whitespace-pre-wrap break-words text-sm">
          {description}
        </p>
      </div>
    </div>
  );
};

export default DescriptionTooltip;
