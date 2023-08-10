import Link from "next/link";
import { FiGithub } from "react-icons/fi";
import { FaLinkedin } from "react-icons/fa";
import Layout from "../components/Layout";
import Head from "next/head";
import { useEffect, useState, useRef } from "react";
import ProjectCard from '../components/ProjectCard';
import ChatApp from "../components/Chat/ChatApp";
export default function Index(props) {
  const [offsetY, setOffsetY] = useState(0);

  const handleScroll = () => {
    setOffsetY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
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
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="language" content="English" />
      </Head>
      <Layout id="home">
        <div
          className="flex flex-col items-end justify-center"
          style={{ height: "80vh" }}
        >
          <h1 className="font-bold text-8xl text-heading text-center">
            Hi, I'm{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Aaron Goidel
            </span>
          </h1>
        </div>

        {/* New Content Section */}
        <div className="py-16">
          <ChatApp />
        </div>
        <div id="about" className="px-4 py-16 relative">
          <h2 className="text-4xl mb-4 font-bold">About Me</h2>
          <p className="mb-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque
            nisl eros, pulvinar facilisis justo mollis, auctor consequat urna.
            Morbi a bibendum metus. Donec scelerisque sollicitudin enim eu
            venenatis. Duis tincidunt, mauris in vehicula lacinia, lacus nisl
            consectetur nisi, non tempor mauris ex a mauris. Suspendisse in
            vestibulum ligula. Nunc rutrum massa in libero blandit, nec luctus
            nulla volutpat.
          </p>
          <p className="mb-4">
            Fusce varius, ligula non tempus aliquam, nunc turpis ullamcorper
            nibh, in tempor sapien arcu a ligula. Sed venenatis dolor mi, at
            vehicula ipsum. Consectetur adipiscing elit. Mauris quis risus vitae
            turpis interdum consequat ut quis arcu. Curabitur quis accumsan
            sapien, proin mattis viverra.
          </p>
          <p className="mb-4">
            Pellentesque vitae fermentum quam. Vivamus non vehicula ipsum, in
            tincidunt mauris. Nunc aliquet, ipsum a aliquet facilisis, urna
            lorem dictum neque, quis accumsan diam nibh a metus. Fusce eu velit
            volutpat, dictum enim at, viverra ex. In in dolor quis purus
            ullamcorper vulputate in at odio.
          </p>
        </div>

        <div id="projects" className="px-4 py-16 relative">
          <h2 className="text-4xl mb-4 font-bold">Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5].map((project) => ( 
              <ProjectCard key={project} 
              title="Project Title"
              description="In est commodo laborum sint magna culpa quis duis. Voluptate id proident voluptate dolore enim sint amet dolore irure Lorem nulla enim exercitation."
              image="/images/cookie.webp"
              link="https://google.com"
              ghLink="AaronCGoidel/this-is-me"
              />
              ))}
              {[1, 2].map((project) => ( 
              <ProjectCard key={project} 
              title="Project Title"
              description="In est commodo laborum sint magna culpa quis duis. Voluptate id proident voluptate dolore enim sint amet dolore irure Lorem nulla enim exercitation."
              image="/images/cookie.webp"
              ghLink="AaronCGoidel/this-is-me"
              />
              ))}
          </div>
        </div>



      </Layout>
    </>
  );
}
