import Tag from "./Tag";
import { motion } from "framer-motion";
import { useRouter } from "next/router";

const ProjectCard = ({ img, proj }) => {
  const router = useRouter();
  return (
    <motion.div
      // initial={{ scale: 0.8, opacity: 0 }}
      // animate={{ scale: 1, opacity: 1 }}
      layoutId={"proj-container"}
      className={"project-card"}
      onClick={() => {
        router.push(`/project/${proj}`);
      }}
    >
      <motion.img layoutId="img" className={"card-img"} src={img} />
      <div className={"card-content"}>
        <motion.h2 layoutId="title">Lectern</motion.h2>
        <motion.p>Foo bar</motion.p>
        <div className="tags">
          <Tag color={"#0ff000"}></Tag>
          <Tag color={"#0ff000"}></Tag>
          <Tag color={"#0ff000"}></Tag>
          <Tag color={"#0ff000"}></Tag>
        </div>
      </div>
    </motion.div>
  );
};
export default ProjectCard;
