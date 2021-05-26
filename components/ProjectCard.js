const ProjectCard = ({ img }) => {
  return (
    <div className={"project-card"}>
      <img className={"card-img"} src={img}></img>
      <div className={"card-content"}>
        <h3>Lectern</h3>
        <p></p>
      </div>
    </div>
  );
};
export default ProjectCard;
