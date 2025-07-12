import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useIntersectionObserver } from "~common/hooks/use-intersection-observer";
import type { Stack } from "~common/types/stack.type";
import type { ProjectEntry } from "~common/types/project.type";
import RelatedProjectsModal from "~features/projects/components/related-projects-modal";

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
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{
          opacity: { duration: 0.2 },
        }}
        onClick={() => setShowRelated(true)}
        className="group relative flex cursor-pointer items-center gap-3 rounded-lg bg-transparent px-3 py-2.5 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/80"
      >
        <div className="text-lg text-skin-accent">
          <stack.icon
            className="transition-transform duration-200 ease-out group-hover:scale-110"
            style={{ color: stack.color }}
          />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-medium text-black-accent group-hover:text-skin-accent">
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
          {/* <p className="truncate text-xs text-black-muted group-hover:text-black-base/80">
            {stack.description}
          </p> */}
        </div>
      </motion.div>

      <AnimatePresence>
        {showRelated && (
          <RelatedProjectsModal
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
