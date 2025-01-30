// ProjectCard.tsx
import React, { useState, useCallback, useRef } from "react";
import Skeleton from "react-loading-skeleton";
import ImageWithSkeleton from "~components/Skeleton/ImageWithSkeleton";

import { loadSlim } from "tsparticles-slim";
import { Particles as ReactParticles } from "react-tsparticles";
import type { Engine } from "tsparticles-engine";
import { useIntersectionObserver } from "~hooks/UseIntersectionObserver/UseIntersectionObserver";
import type { CollectionEntry } from "astro:content";

const ProjectCard: React.FC<CollectionEntry<"projects">> = props => {
  const [isLoading, setIsLoading] = useState(true);
  const cardRef = useRef<HTMLDivElement>(null);
  const isVisible = useIntersectionObserver(cardRef);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <a href={`/projects/${props.id}`} className="group block">
      <article
        ref={cardRef}
        className={`bg-skin-card relative h-full overflow-hidden rounded-2xl shadow-lg transition-all duration-700 ease-out ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        } hover:-translate-y-1 hover:shadow-xl`}
      >
        <ReactParticles
          id={`particles-${props.id}`}
          className="absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          init={particlesInit}
          options={{
            fullScreen: { enable: false },
            background: {
              color: {
                value: "transparent",
              },
            },
            fpsLimit: 120,
            particles: {
              color: {
                value: ["#ffffff", "#E3E6EC", "#f8f8ff"],
              },
              links: {
                color: {
                  value: "rgba(255, 255, 255, 0.35)",
                },
                distance: 150,
                enable: true,
                opacity: 0.35,
                width: 0.8,
                triangles: {
                  enable: true,
                  opacity: 0.05,
                  frequency: 0.01,
                },
              },
              move: {
                direction: "none",
                enable: true,
                outModes: {
                  default: "out",
                },
                random: true,
                speed: 0.4,
                straight: false,
              },
              number: {
                density: {
                  enable: true,
                  area: 900,
                },
                value: 45,
              },
              opacity: {
                value: 1,
                random: true,
                animation: {
                  enable: true,
                  speed: 0.8,
                  minimumValue: 0.3,
                  sync: false,
                },
              },
              shape: {
                type: ["circle", "star"],
              },
              size: {
                value: { min: 1, max: 3 },
                random: true,
                animation: {
                  enable: true,
                  speed: 0.8,
                  minimumValue: 0.5,
                  sync: false,
                },
              },
              twinkle: {
                particles: {
                  enable: true,
                  frequency: 0.04,
                  opacity: 1,
                  color: {
                    value: "#ffffff",
                  },
                },
              },
              blur: {
                enable: true,
                strength: 2,
              },
            },
            detectRetina: true,
          }}
        />
        <div className="aspect-[4/3] w-full overflow-hidden">
          <ImageWithSkeleton
            src={props.data.imageUrl}
            alt={props.data.projectName}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onLoadComplete={handleImageLoad}
          />
        </div>
        <div className="p-4 lg:p-5">
          <p className="mb-3 text-sm font-medium uppercase tracking-wider text-black-base">
            {isLoading ? <Skeleton /> : props.data.shortDescription}
          </p>
          <div className="flex flex-wrap gap-2">
            {props.data.roles.map((role, idx) => (
              <span
                key={idx}
                className="inline-flex items-center rounded-full bg-skin-accent/10 px-2.5 py-0.5 text-xs font-medium text-skin-accent"
              >
                {isLoading ? <Skeleton width={40} height={16} /> : role}
              </span>
            ))}
          </div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/80 via-black/60 to-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="p-4 text-center">
            <p className="mb-2 text-base font-medium text-white-base lg:text-lg">
              {isLoading ? <Skeleton /> : props.data.companyName}
            </p>
            <h3 className="text-xl font-bold text-white-base lg:text-2xl">
              {isLoading ? <Skeleton /> : props.data.projectName}
            </h3>
          </div>
        </div>
      </article>
    </a>
  );
};

export default ProjectCard;
