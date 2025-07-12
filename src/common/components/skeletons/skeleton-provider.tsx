import React, {
  createContext,
  useState,
  useContext,
  type ReactNode,
} from "react";
import { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface SkeletonContextProps {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

const SkeletonContext = createContext<SkeletonContextProps | undefined>(
  undefined,
);

interface SkeletonProviderProps {
  children: ReactNode;
}

export const SkeletonProvider = ({ children }: SkeletonProviderProps) => {
  const [isLoading, setLoading] = useState(true);

  return (
    <SkeletonContext.Provider value={{ isLoading, setLoading }}>
      <SkeletonTheme baseColor="#202020" highlightColor="#444">
        {children}
      </SkeletonTheme>
    </SkeletonContext.Provider>
  );
};

export const useSkeleton = () => {
  const context = useContext(SkeletonContext);
  if (!context) {
    throw new Error("useSkeleton must be used within a SkeletonProvider");
  }
  return context;
};
