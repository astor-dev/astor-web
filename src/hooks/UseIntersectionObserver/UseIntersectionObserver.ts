import { useEffect, useState } from "react";
import type { RefObject } from "react";

interface UseIntersectionObserverProps {
  threshold?: number;
  rootMargin?: string;
}

export const useIntersectionObserver = <T extends Element | null>(
  elementRef: RefObject<T>,
  { threshold = 0.1, rootMargin = "50px" }: UseIntersectionObserverProps = {},
) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            requestAnimationFrame(() => {
              setIsVisible(true);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold,
        rootMargin,
      },
    );

    const element = elementRef.current;
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [elementRef, threshold, rootMargin]);

  return isVisible;
};
