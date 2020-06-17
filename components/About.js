import globalStyles from "../styles/global.js";

const About = (props) => (
  <div ref={props.aboutRef} className="section">
    <div className="heading">
      <h1>About Me</h1>
      <div className="highlight" />
    </div>
    <p>
      Hi, my name is Aaron Goidel. I am currently a second year, studying
      Computer Science at the University of Toronto.
    </p>
    <style jsx>{``}</style>
    <style jsx global>
      {globalStyles}
    </style>
  </div>
);

export default About;
