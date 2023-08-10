import React from 'react';
import ProjectCard from '../ProjectCard';

const Projects = (): JSX.Element => {
    return (
        <div id="projects" className="px-4 pt-16 pb-8 relative">
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
    );
}

export default Projects;