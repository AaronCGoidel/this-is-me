import React from "react";
import ProjectCard from "../ProjectCard";
import { Project } from "../../types/project";

type ProjectsProps = {
  projectsPerPage: number;
};

const Projects = ({ projectsPerPage }: ProjectsProps): JSX.Element => {
  const projects: Project[] = [
    {
      title: "Cookie - Dynamic Cookbook",
      description: "Better cooking through ml and graph theory. Recipe customization, ingredient substitution, realtime custom interactive steps.",
      image: "/images/cookie.webp",
      ghLink: "UpperMountain/dynamic-cookbook",
    },
    {
      title: "Icing",
      description: "A ml-powered visual product reccomendation tool. Using cnn feature extraction and attention, find products that match the style of an image.",
      image: "/images/icing.webp",
      ghLink: "AaronCGoidel/icing",
    },
    {
      title: "NeRF 3D Reconstruction",
      description: "An video to AR 3D reconstruction pipeline using Neural Radiance Fields. A deep learning model predicts scene radiance for a volumetric renderer.",
      image: "/images/nerf.webp",
      ghLink: "AaronCGoidel/NeRF",
    },
    {
      title: "AaronAI",
      description: "A new kind of personal site: a portfolio chatbot. AaronAI is armed with a knowledge base of my resume, projects, and more.",
      image: "/images/aaronai.webp",
      ghLink: "AaronCGoidel/this-is-me",
    },
    {
      title: "Simulating Galaxies",
      description: "Simulating the formation of galactic structures with a highly optimized n-body simulation written in pure C and OpenGL.",
      image: "/images/galaxy.webp",
      ghLink: "AaronCGoidel/n-body",
    },
    {
      title: "SlothLang",
      description: "A programming language for the sloth in all of us. A simple, interpreted esolang written in C.",
      image: "/images/sloth.webp",
      ghLink: "AaronCGoidel/SlothLang",
    },
    {
      title: "SEA",
      description:
        "Shoddy Editor by Aaron (SEA) is a minimal text editor written in Go. Supports syntax highlighting, file management, and more.",
      image: "/images/sea.webp",
      ghLink: "AaronCGoidel/SEA",
    },
    {
      title: "SafeSend",
      description:
        "Apply cryptography and 2-factor-authentication to data sharing. Generate secure ephemeral links to share sensitive data.",
      image: "/images/safesend.webp",
      ghLink: "MKA-Stem/ayc-galvanize",
    },
    {
      title: "Lectern",
      description: "A crypto ecosystem for knowledge sharing and tutoring. Get matched with tutors and get paid in crypto.",
      image: "/images/lectern.webp",
      ghLink: "AaronCGoidel/lectern",
    },
    {
      title: "Track-19",
      description: "A secure and private covid news and reporting platform.",
      image: "/images/track19.webp",
      ghLink: "AaronCGoidel/Covid",
    },
    
  ];

  const [currentPage, setCurrentPage] = React.useState(1);

  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = projects.slice(
    indexOfFirstProject,
    indexOfLastProject
  );

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(projects.length / projectsPerPage); i++) {
    pageNumbers.push(i);
  }

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const buttonStyle = {
    margin: "5px",
    padding: "8px 12px",
    border: "none",
    cursor: "pointer",
    borderRadius: "5px",
    backgroundColor: "#f0f0f0",
  };

  const activeButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#ccc"
  };

  return (
    <div id="projects" className="px-4 pt-16 pb-8 relative">
      <h2 className="text-4xl mb-4 font-bold">Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {currentProjects.map((project, index) => (
          <ProjectCard key={index} {...project} />
        ))}
      </div>
      <div className="pagination-buttons flex justify-center mt-6">
        <button
          style={
            currentPage > 1 ? buttonStyle : { ...buttonStyle, opacity: 0.5 }
          }
          onClick={() => currentPage > 1 && paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => paginate(number)}
            style={currentPage === number ? activeButtonStyle : buttonStyle}
          >
            {number}
          </button>
        ))}
        <button
          style={
            currentPage < Math.ceil(projects.length / projectsPerPage)
              ? buttonStyle
              : { ...buttonStyle, opacity: 0.5 }
          }
          onClick={() =>
            currentPage < Math.ceil(projects.length / projectsPerPage) &&
            paginate(currentPage + 1)
          }
          disabled={
            currentPage === Math.ceil(projects.length / projectsPerPage)
          }
        >
          Next
        </button>
      </div>
    </div>
  );
};

Projects.defaultProps = {
  projectsPerPage: 6,
};

export default Projects;
