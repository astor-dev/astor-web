import React from "react";

import { FaCode, FaPen, FaPlus } from "react-icons/fa";

const IconRecord: Record<string, React.ElementType> = {
  FaCode: FaCode,
  FaPen: FaPen,
};

export interface ActionCardProps {
  href: string;
  icon: keyof typeof IconRecord;
  title: string;
  description: string;
}

const ActionCard: React.FC<ActionCardProps> = ({
  href,
  icon,
  title,
  description,
}) => {
  const Icon = IconRecord[icon];
  return (
    <a
      href={href}
      className="flex items-center justify-between rounded-lg bg-white p-6 shadow-sm transition-all hover:shadow-md"
    >
      <div className="flex items-center gap-4">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-skin-accent/10">
          <Icon />
        </span>
        <div>
          <h2 className="text-lg font-semibold text-black-accent">{title}</h2>
          <p className="text-sm text-black-muted">{description}</p>
        </div>
      </div>
      <FaPlus className="text-skin-accent" />
    </a>
  );
};

export default ActionCard;
