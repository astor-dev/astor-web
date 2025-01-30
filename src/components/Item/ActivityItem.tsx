import React from "react";

export interface ActivityItemProps {
  title: string;
  description: string;
  timestamp: string;
  isLast?: boolean;
}

const ActivityItem: React.FC<ActivityItemProps> = ({
  title,
  description,
  timestamp,
  isLast = false,
}) => {
  return (
    <div
      className={`flex items-center justify-between ${!isLast ? "border-b pb-4" : ""}`}
    >
      <div>
        <p className="font-medium text-black-accent">{title}</p>
        <p className="text-sm text-black-muted">{description}</p>
      </div>
      <span className="text-sm text-black-muted">{timestamp}</span>
    </div>
  );
};

export default ActivityItem;
