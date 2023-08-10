import React from "react";
import ProjectCard from "../ProjectCard";
import { Project } from "../../types/project";

type ProjectsProps = {
  projectsPerPage: number;
};

const Projects = ({ projectsPerPage }: ProjectsProps): JSX.Element => {
  const projects: Project[] = [
    {
      title: "Cookie",
      description: "Better cooking through ml and graph theory",
      image: "/images/cookie.webp",
      link: "https://google.com",
      ghLink: " UpperMountain/dynamic-cookbook",
    },
    {
      title: "Icing",
      description: "A ml-powered visual product reccomendation tool",
      image: "/images/icing.webp",
      ghLink: "AaronCGoidel/icing",
    },
    {
      title: "Simulating Galaxies",
      description: "Simulating galaxies with n-body simulation",
      image: "/images/galaxy.webp",
      ghLink: "AaronCGoidel/n-body",
    },
    {
      title: "SafeSend",
      description:
        "Apply cryptography and 2-factor-authentication to data sharing",
      image: "/images/safesend.webp",
    },
    {
      title: "SEA",
      description:
        "Shoddy Editor by Aaron (SEA) is a minimal text editor written in go",
      image: "/images/sea.webp",
      ghLink: "AaronCGoidel/SEA",
    },
    {
      title: "SlothLang",
      description: "A programming language for the sloth in all of us",
      image: "/images/sloth.webp",
      ghLink: "AaronCGoidel/SlothLang",
    },
    {
      title: "Lectern",
      description: "A crypto ecosystem for knowledge sharing and tutoring",
      image: "/images/lectern.webp",
    },
    {
      title: "Track-19",
      description: "A contact tracing app for COVID-19",
      image: "/images/track19.webp",
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
