import React, { useState, useEffect } from "react";

const Hero = (): JSX.Element => {
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      const fadeRate = 1 / (window.innerHeight * 0.35);
      const newOpacity = 1 - window.scrollY * fadeRate;
      setOpacity(newOpacity > 0 ? newOpacity : 0);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className="flex flex-col items-center justify-between"
      style={{ height: "80vh" }}
    >
      <div className="flex-1 flex items-center justify-center">
        <h1 className="font-bold text-8xl text-heading text-center">
          Hi, I'm{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
            Aaron Goidel
          </span>
        </h1>
      </div>

      <div
        className="animate-bounce mb-5 flex flex-col items-center justify-center"
        style={{ opacity }}
      >
        <p className="text-gray-500 text-sm">scroll</p>
        <svg
          className="w-6 h-6 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 9l6 6 6-6"
          />
        </svg>
      </div>
    </div>
  );
};
export default Hero;
