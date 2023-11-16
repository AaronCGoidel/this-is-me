import React from "react";

const About = (): JSX.Element => {
  return (
    <div id="about" className="px-4 pt-12 prose lg:prose-md max-w-none">
      <h2 className="text-4xl mb-4 font-bold text-heading">About Me</h2>

      <p>
        Currently pursuing Computer Science and Linguistics at the University of
        Toronto, I am deeply involved in NLP research on cross-linguistic
        semantics. My dual roles as a Research Assistant and a TA for Theory of
        Computation showcase my commitment to both theoretical understanding and
        its practical applications.
      </p>
      <p>I've worked with some fantastic organizations</p>
      <ul>
        <li>
          At NASA, I contributed to launch software for the groundbreaking Artemis program.
        </li>
        <li>
          While at MLabs, I developed tools and smart contracts for financial tech on the Cardano blockchain.
        </li>
        <li>
          My media tenure with Highsnobiety offered a unique blend of tech and
          art where I helped build data collection pipelines and content management software.
        </li>
        <li>
          With the NSA, I researched novel applications of machine learning for security applications and fortified Linux systems security.
        </li>
      </ul>

      <p>
        Beyond my studies, I am a fervent tinkerer and reader, driven by a
        belief that software can shape a brighter, more informed future.
      </p>

      <p>
        My academic passions lie in computational linguistics and the intricate
        world of languages and compilers. As the Technical Director of the Math
        and Computer Science Society, I mentor peers, bridging theoretical
        concepts with practical execution.
      </p>

      <p>
        Outside academia, I've crafted production-grade software for diverse
        teams. My explorations in computer science span from designing languages
        and simulating physics to delving into blockchain. Off the screen, my
        love for culinary arts keeps me experimenting in the kitchen, while
        music is both a solace and a creative outlet.
      </p>
    </div>
  );
};

export default About;
