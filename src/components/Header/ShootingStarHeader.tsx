import { motion } from "framer-motion";
import { PiShootingStarFill } from "react-icons/pi";
import { useRef } from "react";
import { useIntersectionObserver } from "~hooks/UseIntersectionObserver/UseIntersectionObserver";

interface ShootingStarHeaderProps {
  title: string;
  description?: string;
  moreLink?: string;
}

export const ShootingStarHeader = ({
  title,
  description,
  moreLink,
}: ShootingStarHeaderProps) => {
  const headerRef = useRef<HTMLDivElement>(null);
  const isVisible = useIntersectionObserver(headerRef);

  return (
    <div
      ref={headerRef}
      className={`mb-8 flex flex-col transition-all duration-700 ease-out ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      }`}
    >
      <div className="flex items-center justify-between">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="font-sans text-2xl font-bold text-black-base"
        >
          <span className="text-skin-accent">✦</span> {title}
        </motion.h2>

        {moreLink && (
          <motion.a
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ x: 4 }}
            transition={{ type: "tween", duration: 0.2 }}
            href={moreLink}
            className="inline-flex items-center gap-1 font-sans text-sm text-skin-accent hover:text-skin-accent/80"
          >
            More <PiShootingStarFill />
          </motion.a>
        )}
      </div>

      {description && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-1 text-black-muted"
        >
          {description}
        </motion.p>
      )}
    </div>
  );
};
