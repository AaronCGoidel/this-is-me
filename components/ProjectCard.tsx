import React from "react";
import { FaGithub, FaLink } from "react-icons/fa";

type ProjectCardProps = {
  title: string;
  description: string;
  image: string;
  link?: string;
  ghLink?: string;
};

const ProjectCard = ({
  title,
  description,
  image,
  link,
  ghLink,
}: ProjectCardProps) => {
  return (
    <div className="flex flex-col w-full bg-white shadow-xl rounded-lg overflow-hidden">
      {/* image with max height 40 and object fit cover */}
        <img
            className="h-40 w-full object-cover"
            src={image}
            alt={title}
        />
      <div className="flex flex-col flex-grow p-4">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-gray-500 text-sm">{description}</p>
        <div className="flex flex-row flex-wrap justify-center gap-5 mt-2">
          {link && (
            <div className="flex flex-row">
                <FaLink className="mx-2"/>
            <a
            className="text-sm hover:bg-gray-200 px-1 hover:text-gray-700 hover:border-gray-700"
              href={link}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Project
            </a>
            </div>
          )}
          {ghLink && (
            <div className="flex flex-row">
            <FaGithub className="mx-2"/>
            <a
              className="text-sm hover:bg-gray-200 px-1 hover:text-gray-700 hover:border-gray-700"
              href={`https://github.com/${ghLink}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Code
            </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
