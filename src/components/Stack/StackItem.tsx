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
        className="group relative flex cursor-pointer items-center gap-3 rounded-lg bg-white/50 px-3 py-2.5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/80 hover:shadow-md active:translate-y-0 active:bg-white/70 active:shadow"
      >
        <div className="text-xl text-skin-accent">
          <stack.icon
            className="transition-transform duration-200 ease-out group-hover:scale-110 group-active:scale-95"
            style={{ color: stack.color }}
          />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-medium text-black-accent group-hover:text-skin-accent group-active:text-skin-accent/90">
            {stack.name}
            {showFeatured && stack.featured && (
              <span
                className={`ml-1 inline-block opacity-75 ${
                  stack.superFeatured ? "text-skin-accent" : "text-yellow-500"
                }`}
              >
                ★
              </span>
            )}
          </h3>
          <p className="truncate text-xs text-black-muted group-hover:text-black-base/80">
            {stack.description}
          </p>
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
