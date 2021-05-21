import globalStyles from "../styles/global.js";
import Button from "./Button";
import { AiOutlineMail } from "react-icons/ai";

const About = (props) => (
  <div ref={props.aboutRef} className="section">
    <div className="heading">
      <h1>About Me</h1>
    </div>
    <div className="contents bio">
      <p>
        I am currently studying{" "}
        <span className="calledout">Computer Science</span> and{" "}
        <span className="calledout">Linguistics</span> at the University of
        Toronto. I work part-time as a backend engineer and am always tinkering
        and reading. I am passionate about software as the tool to build a
        better future.
      </p>
      <br />
      <p>
        My main interests in school are in computational linguistics as well as
        languages and compilers. I have experience developing production
        software in teams small to large.
      </p>
      <br />
      <p>
        I enjoy making small web projects as well as exploring many other areas
        of computer science. These range from language design, to physics
        simulations, to blockchain, and beyond. I have a love of all things food
        and cooking and I am always listening to or making music.
      </p>
    </div>
    <div className="centered">
      <h3>Have an idea for a website you want done?</h3>
      <h3>I am currently accepting new projects.</h3>
      <Button secondary text={"Email Me"} href="mailto:acgoidel@gmail.com">
        <AiOutlineMail style={{ margin: "10px" }} />
      </Button>
    </div>
    <style jsx>{`
      .calledout {
        font-weight: bold;
      }

      h3 {
        margin: 10px;
        text-align: center;
      }
      p {
        margin: 10px;
      }
      .bio {
        width: 80vw;
      }

      .centered {
        margin: 10vh 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }

      @media (max-width: );
    `}</style>
    <style jsx global>
      {globalStyles}
    </style>
  </div>
);

export default About;
