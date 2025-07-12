import { motion } from "framer-motion";
import { PiShootingStarFill } from "react-icons/pi";
import { useEffect, useRef, useState } from "react";

import Skeleton from "react-loading-skeleton";
import { useIntersectionObserver } from "~common/hooks/use-intersection-observer";

interface ShootingStarHeaderProps {
  title: string;
  description?: string;
  moreLink?: string;
  showInitialAnimation?: boolean;
}

export const ShootingStarHeader = ({
  title,
  description,
  moreLink,
  showInitialAnimation = false,
}: ShootingStarHeaderProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const hasMounted = useRef(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const isVisible = useIntersectionObserver(headerRef);

  useEffect(() => {
    hasMounted.current = true;
  }, []);

  useEffect(() => {
    if (isVisible && title && hasMounted.current) {
      setIsLoading(false);
    }
  }, [isVisible, title, description, moreLink]);
  return (
    <div
      ref={headerRef}
      className={`mb-4 flex flex-col ${
        showInitialAnimation ? "transition-all duration-700 ease-out" : ""
      } ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
    >
      <div className="flex items-center justify-between">
        <motion.h2 className="font-sans text-2xl font-bold text-black-base">
          {/* <span className="text-skin-accent">✦</span>  */}
          {isLoading ? <Skeleton className="w-full" /> : title}
        </motion.h2>

        {moreLink && (
          <motion.a
            whileHover={{ x: 4 }}
            href={moreLink}
            className="inline-flex items-center gap-1 font-sans text-sm text-skin-accent hover:text-skin-accent/80"
          >
            {isLoading ? (
              <Skeleton />
            ) : (
              <>
                More <PiShootingStarFill />
              </>
            )}
          </motion.a>
        )}
      </div>

      {description && (
        <motion.p className="mt-1 text-black-muted">{description}</motion.p>
      )}
    </div>
  );
};
