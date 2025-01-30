import React from "react";
import { FaChartBar } from "react-icons/fa";

export interface StatCardProps {
  label: string;
  value: string | number;
}

const StatCard: React.FC<StatCardProps> = ({ label, value }) => {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2">
        <FaChartBar className="text-skin-accent" />
        <span className="text-sm text-black-muted">{label}</span>
      </div>
      <p className="mt-2 text-2xl font-bold text-black-accent">{value}</p>
    </div>
  );
};

export default StatCard;
