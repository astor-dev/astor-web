import React from "react";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import { getBreadcrumbPaths } from "~components/Breadcrumb/utils";

interface BreadcrumbProps {
  pathname: string; // 현재 경로를 전달받음
}

const BreadcrumbNavigator: React.FC<BreadcrumbProps> = ({ pathname }) => {
  const breadcrumbPaths = getBreadcrumbPaths(pathname); // Breadcrumb 경로 생성

  return (
    <div className="flex items-center space-x-2 rounded-lg bg-skin-card p-4">
      {breadcrumbPaths.map((path, index) => (
        <React.Fragment key={index}>
          <a
            href={path.link}
            className={
              index === breadcrumbPaths.length - 1
                ? "font-semibold text-skin-accent"
                : "hover:text-skin-secondary text-skin-base"
            }
          >
            {path.name}
          </a>
          {index < breadcrumbPaths.length - 1 && (
            <ChevronRightIcon className="text-skin-muted h-5 w-5" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default BreadcrumbNavigator;
