import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import Tag from "../../components/Tag";

const ProjectPage = (props) => {
  const router = useRouter();

  const { projId } = router.query;

  return (
    <motion.div
      style={{ color: "#fff" }}
      layoutId={`proj-container-${props.proj.slug}`}
      className="project-container"
    >
      <IoMdArrowRoundBack
        size={50}
        style={{
          position: "fixed",
          top: "1rem",
          left: "1rem",
          zIndex: 2,
          cursor: "pointer",
        }}
        onClick={() => {
          router.push("/#projects");
        }}
      />
      <div className={`meta-info`}>
        <motion.img
          layoutId={`img-${props.proj.slug}`}
          src={props.proj.cover}
          className="cover-img"
        />
        <div className={"text-meta"}>
          <motion.h1 layoutId={`title-${props.proj.slug}`}>{props.proj.title}</motion.h1>
          <motion.p>{props.proj.subtitle}</motion.p>
          <div className="meta-tags">
            {props.proj.tags.split(", ").map((tag) => {
              return <Tag tag={tag} />;
            })}
          </div>
        </div>
      </div>
      <div className="content">
        <ReactMarkdown>{props.proj.content}</ReactMarkdown>
      </div>
    </motion.div>
  );
};

export async function getStaticProps(context) {
  const fs = require("fs");
  const matter = require("gray-matter");

  const slug = context.params.projId;
  const path = `${process.cwd()}/pages/projects/${slug}.md`;

  const rawContent = fs.readFileSync(path, {
    encoding: "utf-8",
  });

  const { data, content } = matter(rawContent);
  return {
    props: {
      proj: {
        ...data,
        content: content,
      },
    },
  };
}

export async function getStaticPaths(context) {
  const fs = require("fs");

  const path = `${process.cwd()}/pages/projects`;
  const files = fs.readdirSync(path, "utf-8");

  const markdownFileNames = files
    .filter((fn) => fn.endsWith(".md"))
    .map((fn) => fn.replace(".md", ""));

  return {
    paths: markdownFileNames.map((fileName) => {
      return {
        params: {
          projId: fileName,
        },
      };
    }),
    fallback: false,
  };
}

export default ProjectPage;
