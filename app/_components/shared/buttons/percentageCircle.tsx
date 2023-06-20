import React from "react";

interface PercentageCirlceProps {
  percentage: number;
}

const PercentageCircle: React.FC<PercentageCirlceProps> = ({ percentage }) => {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex space-x-2 justify-center">
    <svg width="20" height="20" viewBox="0 0 120 120">
      <circle
        stroke="#eee"
        strokeWidth="20"
        fill="transparent"
        r={radius}
        cx="60"
        cy="60"
      />
      <circle
        stroke="#0010ff"
        strokeWidth="20"
        strokeDasharray={`${circumference} ${circumference}`}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        fill="transparent"
        r={radius}
        cx="60"
        cy="60"
        transform={`rotate(-90 60 60)`}
      />
    </svg>
    <span className="">{(`${percentage}%`)}</span>
    </div>
  );
};

export default PercentageCircle;
