import React, { useRef, type ReactNode } from "react";
import type { CollectionEntry } from "astro:content";
import type { ProjectEntry } from "~types/project.type";
import { useIntersectionObserver } from "~hooks/UseIntersectionObserver/UseIntersectionObserver";
import ImageWithSkeleton from "~components/Skeleton/ImageWithSkeleton";
import IconButton from "~components/Button/IconButton";
import StackGrid from "~components/Stack/StackGrid";

// ... rest of the existing code ...
