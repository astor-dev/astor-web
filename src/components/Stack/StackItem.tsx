import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { type Stack } from "~types/stack.type";
import { useIntersectionObserver } from "~hooks/UseIntersectionObserver/UseIntersectionObserver";

interface StackItemProps {
  stack: Stack;
}

const StackItem: React.FC<StackItemProps> = ({ stack }) => {
  const [isOpen, setIsOpen] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);
  const isVisible = useIntersectionObserver(itemRef);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <motion.div
      ref={itemRef}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: isVisible ? 1 : 0,
        y: isVisible ? 0 : 20,
      }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      onClick={toggleOpen}
      className="active:bg-skin-card/70 md:hover:bg-skin-card/50 group relative flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-300"
    >
      {/* 아이콘 */}
      <div className="text-xl text-skin-accent">
        <stack.icon className="transition-transform duration-300 md:group-hover:scale-110" />
      </div>

      {/* 스택 정보 */}
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-medium text-black-accent">
          {stack.name}
        </h3>
        <p className="text-black-muted truncate text-xs">{stack.description}</p>
      </div>

      {/* 툴팁 (데스크톱) */}
      <div className="pointer-events-none invisible absolute left-1/2 top-[calc(100%+4px)] z-50 w-max -translate-x-1/2 rounded-lg bg-gray-900/90 p-2.5 text-xs opacity-0 shadow-lg transition-all duration-200 md:group-hover:visible md:group-hover:opacity-100">
        <div className="max-w-[200px]">
          <p className="text-white font-medium">{stack.name}</p>
          <p className="mt-1 text-gray-200">{stack.description}</p>
        </div>
      </div>

      {/* 모바일 상세 정보 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-lg bg-gray-900/90 shadow-lg md:hidden"
          >
            <div className="p-3">
              <p className="text-sm font-medium text-white-accent">
                {stack.name}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-gray-200">
                {stack.description}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default StackItem;
