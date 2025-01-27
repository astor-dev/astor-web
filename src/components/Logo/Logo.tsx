import React from "react";

const AstoirLogo: React.FC<React.SVGProps<SVGSVGElement>> = props => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200">
      <defs>
        <linearGradient id="codeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#007ACC", stopOpacity: 1 }} />
          <stop
            offset="100%"
            style={{ stopColor: "#3178C6", stopOpacity: 1 }}
          />
        </linearGradient>
      </defs>

      <path
        d="M50 100 L100 50 L110 60 L70 100 L110 140 L100 150 Z"
        stroke="url(#codeGradient)"
        stroke-width="6"
        fill="none"
      />
      <path
        d="M250 100 L200 50 L190 60 L230 100 L190 140 L200 150 Z"
        stroke="url(#codeGradient)"
        stroke-width="6"
        fill="none"
      />

      <path
        d="M150 50 L165 85 L203 90 L175 118 L182 155 L150 135 L118 155 L125 118 L97 90 L135 85 Z"
        fill="url(#codeGradient)"
        stroke="url(#codeGradient)"
        stroke-width="2"
      />
    </svg>
  );
};

export default AstoirLogo;
