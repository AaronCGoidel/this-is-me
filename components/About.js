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
        I am currently studying Computer Science at the University of Toronto
        and am working designing and developing cross-platform websites.
      </p>
      <br />
      <p>
        I work to make clean, simple, websites which focus on content and ease
        of use. All of my products are dynamic, meaning they will impress on all
        platforms, mobile and desktop.
      </p>
      <br />
      <p>
        My interests are in web development as well as computational linguistics
        and artificial intelligence. I have a love of all things food and
        cooking and I am always listening to or making music.
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
