import React from "react";

const Loader: React.FC = () => {
  return (
    <div className="flex h-full w-full flex-1 items-center justify-center rounded-lg">
      <svg
        style={{
          margin: "auto",
          background: "transparent",
          display: "block",
          maxHeight: "100%",
          maxWidth: "100%"
        }}
        width="50px"
        height="50px"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid"
      >
        <circle
          cx="50"
          cy="50"
          r="30"
          stroke="#e4efff"
          strokeWidth="10"
          fill="none"
        ></circle>
        <circle
          cx="50"
          cy="50"
          r="30"
          stroke="#0010ff"
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            repeatCount="indefinite"
            dur="1.282051282051282s"
            values="0 50 50;180 50 50;720 50 50"
            keyTimes="0;0.5;1"
          ></animateTransform>
          <animate
            attributeName="stroke-dasharray"
            repeatCount="indefinite"
            dur="1.282051282051282s"
            values="18.84955592153876 169.64600329384882;120.63715789784806 67.85840131753952;18.84955592153876 169.64600329384882"
            keyTimes="0;0.5;1"
          ></animate>
        </circle>
      </svg>
    </div>
  );
};

export default Loader;
