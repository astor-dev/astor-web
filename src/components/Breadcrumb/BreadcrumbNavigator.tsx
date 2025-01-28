import React from "react";
import { CgChevronRight } from "react-icons/cg";
import { getBreadcrumbPaths } from "~components/Breadcrumb/utils";

interface BreadcrumbProps {
  pathname: string; // 현재 경로를 전달받음
}

const BreadcrumbNavigator: React.FC<BreadcrumbProps> = ({ pathname }) => {
  const breadcrumbPaths = getBreadcrumbPaths(pathname); // Breadcrumb 경로 생성

  return (
    <div className="bg-skin-card flex items-center space-x-2 rounded-lg p-4">
      {breadcrumbPaths.map((path, index) => (
        <React.Fragment key={index}>
          <a
            href={path.link}
            className={
              index === breadcrumbPaths.length - 1
                ? "font-semibold text-skin-accent"
                : "text-skin-base hover:text-skin-secondary"
            }
          >
            {path.name}
          </a>
          {index < breadcrumbPaths.length - 1 && (
            <CgChevronRight className="text-skin-muted h-5 w-5" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default BreadcrumbNavigator;
