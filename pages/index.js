import Link from "next/link";
import Home from "../components/Home";
import ProjectCard from "../components/ProjectCard";
import { FiGithub } from "react-icons/fi";
import { FaLinkedin } from "react-icons/fa";
import { motion } from "framer-motion";
import Head from "next/head";
import AnimateWhenVisible from "../components/AnimateWhenVisible";

export default function Index(props) {
  return (
    <>
      <Head>
        <title>Aaron Goidel</title>
        <meta name="title" content="Aaron Goidel" />
        <meta
          name="description"
          content="Aaron is a passionate Computer Science student, software developer, and creative."
        />
        <meta
          name="keywords"
          content="web dev, developer, programmer, New York, Toronto, Toronto developer, NYC developer"
        />
        <meta name="robots" content="index, follow" />
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="language" content="English" />
      </Head>
      <Home />
      <main>
        <header>
          <h1>Hi, I'm Aaron!</h1>
        </header>
        <div className={"container"}>
          <section>
            <h1>About Me</h1>
            <p>
              I am an intensely passionate student, currently studying Computer
              Science and Linguistics at the University of Toronto. I work
              part-time as a backend engineer and am always tinkering and
              reading. I am passionate about software as the tool to build a
              better future.
            </p>

            <p>
              My main interests in school are in computational linguistics as
              well as languages and compilers. I am a Technical Officer in the
              Computer Science Student Community, helping students to bridge the
              gap between theory and implementation by mentoring them during the
              development process.
            </p>

            <p>
              Out of school, I have experience developing production software in
              teams small to large. I enjoy making small web projects as well as
              exploring many other areas of computer science. These range from
              language design, to physics simulations, to blockchain, and
              beyond. I have a love of all things food and cooking and I am
              always listening to or making music.
            </p>
          </section>
          <section className="right" id={"projects"}>
            <h1>My Projects</h1>
            <p>
              Whether for school or work, for a hackathon, or just for fun, I am
              constantly working on projects I find interesting. Here are just a
              few of my favorites. Click around for details.
            </p>
            <motion.div transition={{ staggerChildren: 0.1 }} className="cards">
              {props.projects.map((project, i) => {
                return <ProjectCard key={i} num={i} {...project} />;
              })}
            </motion.div>
          </section>

          <section>
            <h1>Resume & Contact</h1>
            <p>Want a copy of my resume?</p>
            <a href="resume.pdf" download="Aaron Goidel Resume.pdf">
              <motion.button whileHover={{ scale: 1.05 }}>
                <p style={{ margin: 0 }}>Download It! </p>
              </motion.button>
            </a>

            <p>You can find me online at the following places</p>
            <div style={{display: "flex", flexDirection: "row"}}>
              <a
                className={"social-link"}
                href={"https://linkedin.com/in/aaroncgoidel"}
                target="_blank"
              >
                <FaLinkedin size={35} />
                LinkedIn
              </a>
              <a
                className={"social-link"}
                href={"https://github.com/aaroncgoidel"}
                target="_blank"
              >
                <FiGithub size={35} />
                GitHub
              </a>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

export async function getStaticProps() {
  const fs = require("fs");
  const matter = require("gray-matter");

  const files = fs.readdirSync(`${process.cwd()}/pages/projects`, "utf-8");

  const projects = files
    .filter((fn) => fn.endsWith(".md"))
    .map((fn) => {
      const path = `${process.cwd()}/pages/projects/${fn}`;
      const rawContent = fs.readFileSync(path, {
        encoding: "utf-8",
      });
      const { data } = matter(rawContent);
      return { ...data };
    });
  return {
    props: { projects },
  };
}
