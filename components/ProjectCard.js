const ProjectCard = ({img}) => {
    return <div className={"project-card"}>
        <img className={"card-img"} src={img}>
        </img>
        <div className={"card-content"}>
            <p>Foo</p>
        </div>
    </div>
}
export default ProjectCard;