import Link from "next/link";
import { FiGithub } from "react-icons/fi";
import { FaLinkedin } from "react-icons/fa";
import Layout from "../components/Layout";
import Head from "next/head";

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
          content="backend dev, blockchain dev, web dev, developer, programmer, New York, Toronto, Toronto developer, NYC developer"
        />
        <meta name="robots" content="index, follow" />
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="language" content="English" />
      </Head>
      <Layout>
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="font-extrabold text-8xl text-heading text-center">
            Hi, I'm{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Aaron Goidel
            </span>
          </h1>
          <div>

          </div>
        </div>
      </Layout>
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
