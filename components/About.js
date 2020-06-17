import globalStyles from "../styles/global.js";

const About = (props) => (
  <div ref={props.aboutRef} className="section">
    <h1>About Me</h1>
    <style jsx>{``}</style>
    <style jsx global>
      {globalStyles}
    </style>
  </div>
);

export default About;
