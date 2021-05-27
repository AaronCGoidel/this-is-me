import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { HiOutlineArrowLeft, HiOutlineExternalLink } from "react-icons/hi";
import { SiGithub, SiYoutube } from "react-icons/si";
import { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import Tag from "../../components/Tag";
import Head from "next/head";
import gfm from "remark-gfm";

const Icon = ({ link }) => {
  let ico = <HiOutlineExternalLink size={40} />;
  if (link.includes("github")) {
    ico = <SiGithub size={40} />;
  } else if (link.includes("youtube")) {
    ico = <SiYoutube size={40} />;
  }
  return (
    <a href={link} target="_blank">
      {ico}
    </a>
  );
};

const ProjectPage = (props) => {
  const router = useRouter();

  const { projId } = router.query;

  return (
    <>
      <Head>
        <title>{props.proj.title} | Aaron Goidel</title>
      </Head>
      <motion.div
        style={{ color: "#fff" }}
        layoutId={`proj-container-${props.proj.slug}`}
        className="project-container"
      >
        <HiOutlineArrowLeft
          size={40}
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
            <motion.h1 layoutId={`title-${props.proj.slug}`}>
              {props.proj.title}
            </motion.h1>
            <motion.p>{props.proj.subtitle}</motion.p>
            <div className="meta-tags">
              {props.proj.tags.split(", ").map((tag) => {
                return <Tag tag={tag} />;
              })}
            </div>
          </div>
        </div>
        <div className="content">
          <ReactMarkdown remarkPlugins={[gfm]}>
            {props.proj.content}
          </ReactMarkdown>
          {props.proj.links && (
            <>
              <h2>Check it out</h2>
              <div className="extern-links">
                {props.proj.links.split(", ").map((link) => {
                  link = "http://" + link;
                  return <Icon link={link} />;
                })}
              </div>
            </>
          )}
        </div>
      </motion.div>
    </>
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
