import React from "react";

const About = (): JSX.Element => {
  return (
    <div id="about" className="px-4 pt-12 prose lg:prose-md max-w-none">
      <h2 className="text-4xl mb-4 font-bold text-heading">About Me</h2>

      <p>
        Hi, I'm Aaron, a Software Engineer based in Seattle, WA, passionate about improving experiences for billions through technology. At Meta, I work on the Media Algorithms team within the Video Infrastructure org, focusing on audio processing and semantic video understanding to enhance video experiences across Facebook and Instagram.
      </p>
      <p>
        I earned my B.S. in Computer Science from the University of Toronto in 2023, graduating with high distinction. During my studies, I was a Dean's List scholar, TA for Theory of Computation, and explored cross-linguistic semantics as a researcher in the Language, Cognition, and Computation group.
      </p>
      <p>
        My career highlights include building launch software for NASA's Artemis I mission and developing decentralized finance applications at MLabs. These roles shaped my ability to deliver impactful, production-ready systems.
      </p>
      <p>
        Outside of work, I'm a foodie inspired by Washington's local farmers markets, an avid reader of sci-fi, and a guitarist. When I'm not cooking, reading, or playing tennis, I enjoy tinkering and solving puzzles.
      </p>

    </div>
  );
};

export default About;
