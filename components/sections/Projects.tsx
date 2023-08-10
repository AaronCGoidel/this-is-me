import React from "react";
import ProjectCard from "../ProjectCard";
import { Project } from "../../types/project";

const Projects = (): JSX.Element => {
  const projects: Project[] = [{
    title: "Cookie",
    description: "Better cooking through ml and graph theory",
    image: "/images/cookie.webp",
    link: "https://google.com",
    ghLink: " UpperMountain/dynamic-cookbook",
  },
  {
    title: "Simulating Galaxies",
    description: "Simulating galaxies with n-body simulation",
    image: "/images/galaxy.webp",
    ghLink: "AaronCGoidel/n-body",
  },
  {
    title: "Lectern",
    description: "A crypto ecosystem for knowledge sharing and tutoring",
    image: "/images/lectern.webp",
  },
  {
    title: "SafeSend",
    description: "Apply cryptography and 2-factor-authentication to data sharing",
    image: "/images/safesend.webp",
  },
  {
    title: "SlothLang",
    description: "A programming language for the sloth in all of us",
    image: "/images/sloth.webp",
    ghLink: "AaronCGoidel/SlothLang",
  },
  {
    title: "Track-19",
    description: "A contact tracing app for COVID-19",
    image: "/images/track19.webp",
  }
];

  return (
    <div id="projects" className="px-4 pt-16 pb-8 relative">
      <h2 className="text-4xl mb-4 font-bold">Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <ProjectCard key={index} {...project} />
        ))}
      </div>
    </div>
  );
};

export default Projects;
