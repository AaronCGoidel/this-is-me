import Tag from "./Tag";
import { motion } from "framer-motion";
import { useRouter } from "next/router";

const ProjectCard = ({ img }) => {
  const router = useRouter();
  return (
    <motion.div
      layoutId={"proj-container"}
      className={"project-card"}
      onClick={() => {
        router.push("/project/1");
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
