import Tag from "./Tag";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useEffect } from "react";

const ProjectCard = (props) => {
  const router = useRouter();
  return (
    <motion.div
      layoutId={`proj-container-${props.slug}`}
      className={"project-card"}
      onClick={() => {
        router.push(`/projects/${props.slug}`);
      }}
    >
      <motion.img
        layoutId={`img-${props.slug}`}
        className={"card-img"}
        src={props.cover}
      />
      <div className={"card-content"}>
        <motion.h2 layoutId={`title-${props.slug}`}>{props.title}</motion.h2>
        <motion.p>{props.subtitle}</motion.p>
        <div className="tags">
          {props.tags.split(", ").map((tag) => {
            return <Tag tag={tag} />;
          })}
        </div>
      </div>
    </motion.div>
  );
};
export default ProjectCard;
