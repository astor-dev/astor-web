// ProjectCard.tsx
import React, { useState, useCallback, useRef, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import ImageWithSkeleton from "~components/Skeleton/ImageWithSkeleton";
import type { Project } from "~types/project.type";
import { loadSlim } from "tsparticles-slim";
import { Particles as ReactParticles } from "react-tsparticles";
import type { Engine } from "tsparticles-engine";

const ProjectCard: React.FC<Project> = props => {
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

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
        threshold: 0.1, // 10%만 보여도 애니메이션 시작
        rootMargin: "50px", // 뷰포트 경계 50px 전에 감지 시작
      },
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <a href={`/projects/${props.projectName}`} className="group block">
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
                value: "#ffffff",
              },
              links: {
                color: "#ffffff",
                distance: 150,
                enable: true,
                opacity: 0.3,
                width: 1,
              },
              move: {
                direction: "none",
                enable: true,
                outModes: {
                  default: "bounce",
                },
                random: true,
                speed: 1,
                straight: false,
              },
              number: {
                density: {
                  enable: true,
                  area: 800,
                },
                value: 80,
              },
              opacity: {
                value: 0.5,
                animation: {
                  enable: true,
                  speed: 1,
                  minimumValue: 0.1,
                },
              },
              shape: {
                type: "circle",
              },
              size: {
                value: { min: 1, max: 3 },
                animation: {
                  enable: true,
                  speed: 2,
                  minimumValue: 0.1,
                },
              },
            },
            detectRetina: true,
          }}
        />
        <div className="aspect-[4/3] w-full overflow-hidden">
          <ImageWithSkeleton
            src={props.imageUrl}
            alt={props.projectName}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onLoadComplete={handleImageLoad}
          />
        </div>
        <div className="p-4 lg:p-5">
          <p className="mb-3 text-sm font-medium uppercase tracking-wider text-black-base">
            {isLoading ? <Skeleton /> : props.shortDescription}
          </p>
          <div className="flex flex-wrap gap-2">
            {props.roles.map((role, idx) => (
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
              {isLoading ? <Skeleton /> : props.companyName}
            </p>
            <h3 className="text-xl font-bold text-white-base lg:text-2xl">
              {isLoading ? <Skeleton /> : props.projectName}
            </h3>
          </div>
        </div>
      </article>
    </a>
  );
};

export default ProjectCard;
