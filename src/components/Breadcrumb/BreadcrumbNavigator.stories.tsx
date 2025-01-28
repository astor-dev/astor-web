import React from "react";
import BreadcrumbNavigator from "./BreadcrumbNavigator";

export default {
  title: "Components/Breadcrumb/BreadcrumbNavigator",
  component: BreadcrumbNavigator,
};

// 홈 경로
export const Home = () => <BreadcrumbNavigator pathname="/" />;

// 프로젝트 목록
export const Projects = () => <BreadcrumbNavigator pathname="/projects" />;

// 프로젝트 상세
export const ProjectDetail = () => (
  <BreadcrumbNavigator pathname="/projects/test-project" />
);

// 깊은 경로
export const DeepPath = () => (
  <BreadcrumbNavigator pathname="/about/team/members" />
);
