import globalStyles from "../styles/global.js";
import ProjectItem from "./ProjectItem.js";

const Projects = (props) => (
  <div ref={props.projRef} className="section">
    <div className="heading">
      <h1>Projects</h1>
      <div className="highlight" />
    </div>
    <ProjectItem
      title={"Project Title"}
      blurb={
        "This is a short blurb about the project and what it is. This will contain actual info at some point. This is a short blurb about the project and what it is. This will contain actual info at some point."
      }
    />
    <ProjectItem
      title={"Project Title"}
      blurb={
        "This is a short blurb about the project and what it is. This will contain actual info at some point. This is a short blurb about the project and what it is. This will contain actual info at some point. This is a short blurb about the project and what it is. This will contain actual info at some point. This is a short blurb about the project and what it is. This will contain actual info at some point."
      }
    />
    <style jsx>{``}</style>
    <style jsx global>
      {globalStyles}
    </style>
  </div>
);

export default Projects;
