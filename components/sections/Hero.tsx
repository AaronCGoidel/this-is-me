import React from "react";

const Hero = (): JSX.Element => {
  return (
    <div
      className="flex flex-col items-end justify-center"
      style={{ height: "80vh" }}
    >
      <h1 className="font-bold text-8xl text-heading text-center">
        Hi, I'm{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
          Aaron Goidel
        </span>
      </h1>
    </div>
  );
};
export default Hero;
