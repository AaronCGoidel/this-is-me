import Tag from "./Tag";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useEffect } from "react";

const ProjectCard = (props) => {
  const router = useRouter();
  return (
    <motion.div
      // initial={{ scale: 0 }}
      // animate={{ scale: 1 }}
      whileHover={{ scale: 1.05 }}
      // transition={{ delay: props.num * 0.1 }}
      layoutId={`proj-container-${props.slug}`}
      className={"project-card"}
      onClick={() => {
        router.push(`/projects/${props.slug}`);
      }}
    >
      <motion.img
        layoutId={`img-${props.slug}`}
        className={"card-img"}
        src={`/images/${props.cover}`}
        alt={`${props.title} Logo`}
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
