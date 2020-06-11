import globalStyles from "../styles/global.js";

const Projects = (props) => (
  <div ref={props.projRef} className="section">
    <h1>Projects</h1>

    <style jsx global>
      {globalStyles}
    </style>
  </div>
);

export default Projects;
