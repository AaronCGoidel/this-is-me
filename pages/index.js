import Layout from "../components/Layout";
import Head from "next/head";
import { useEffect, useState, useRef } from "react";
import Projects from "../components/sections/Projects";
import Contact from "../components/sections/Contact";
import About from "../components/sections/About";
import Chat from "../components/sections/Chat";
import Hero from "../components/sections/Hero";

export default function Index(props) {
  const [offsetY, setOffsetY] = useState(0);
  const [projectsPerPage, setProjectsPerPage] = useState(3);

  const handleScroll = () => {
    setOffsetY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (window.innerWidth < 800) {
      setProjectsPerPage(4);
    } else {
      setProjectsPerPage(6);
    }
  }, []);

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
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="language" content="English" />
        <link rel="icon" href="/aa.png" />
      </Head>
      <Layout id="home">
        <Hero />

        <Chat />

        <About />
        <Projects projectsPerPage={projectsPerPage} />
        <Contact />
      </Layout>
    </>
  );
}
