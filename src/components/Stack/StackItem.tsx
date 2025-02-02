import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { type Stack } from "~types/stack.type";
import { useIntersectionObserver } from "~hooks/UseIntersectionObserver/UseIntersectionObserver";
import type { ProjectEntry } from "~types/project.type";
import RelatedProjects from "~components/Modal/RelatedProjects";
import { FiInfo, FiExternalLink } from "react-icons/fi";

interface StackItemProps {
  stack: Stack;
  showFeatured?: boolean;
  relatedProjects: ProjectEntry[];
}

const StackItem: React.FC<StackItemProps> = ({
  stack,
  showFeatured = false,
  relatedProjects = [],
}) => {
  const [showRelated, setShowRelated] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);
  const isVisible = useIntersectionObserver(itemRef);

  return (
    <>
      <motion.div
        ref={itemRef}
        layout="position"
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        exit={{ opacity: 0 }}
        transition={{
          opacity: { duration: 0.2 },
          layout: { duration: 0.2 },
        }}
        onClick={() => setShowRelated(true)}
        className="group relative flex cursor-pointer items-center gap-3 rounded-lg bg-white/50 px-3 py-2.5 transition-colors hover:bg-white/80"
      >
        <div className="text-xl text-skin-accent">
          <stack.icon
            className="transition-transform ease-out group-hover:scale-105"
            style={{ color: stack.color }}
          />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-medium text-black-accent">
            {stack.name}
            {showFeatured && stack.featured && (
              <span
                className={`ml-1 inline-block opacity-75 ${stack.superFeatured ? "text-skin-accent" : "text-yellow-500"}`}
              >
                ★
              </span>
            )}
          </h3>
          <p className="truncate text-xs text-black-muted">
            {stack.description}
          </p>
        </div>

        {/* 데스크톱 툴팁 */}
        <div className="pointer-events-none invisible absolute left-1/2 top-full z-50 mt-2 w-max -translate-x-1/2 rounded-lg bg-black/80 p-3 text-xs opacity-0 shadow-lg backdrop-blur-sm transition-all duration-200 md:group-hover:visible md:group-hover:opacity-100">
          <div className="max-w-[200px]">
            <p className="text-white font-medium">{stack.name}</p>
            <p className="mt-1 text-gray-200/90">{stack.description}</p>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showRelated && (
          <RelatedProjects
            stack={stack}
            projects={relatedProjects}
            onClose={() => setShowRelated(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default StackItem;
