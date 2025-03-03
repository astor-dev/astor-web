import React from "react";
import { type Experience } from "~types/experience.type";
import { stacks } from "~constants/stacks";

interface ExperienceItemProps {
  experience: Experience;
}

const ExperienceItem: React.FC<ExperienceItemProps> = ({ experience }) => {
  const periodText = `${experience.period.start} - ${
    experience.period.end ?? "Present"
  }`;

  const usedStacks = stacks.filter(stack =>
    experience.skills.includes(stack.id),
  );

  return (
    <div className="bg-white-base space-y-4 rounded-lg p-6 shadow-sm">
      <div>
        <h3 className="text-lg font-bold text-black-accent">
          {experience.role}
          <span className="text-skin-accent"> @ {experience.company}</span>
        </h3>
        <p className="text-sm text-black-base/60">{periodText}</p>
      </div>

      <ul className="ml-5 list-disc space-y-1 text-sm text-black-base">
        {experience.description.map((desc, index) => (
          <li key={index}>{desc}</li>
        ))}
      </ul>

      <div className="space-y-2">
        <p className="text-xs font-medium text-black-base/60">주요 기술 스택</p>
        <div className="flex flex-wrap gap-2">
          {usedStacks.map(stack => (
            <div
              key={stack.id}
              className="bg-skin-card inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs"
            >
              <stack.icon className="text-skin-accent" />
              <span>{stack.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExperienceItem;
