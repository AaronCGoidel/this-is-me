import React from "react";
import styled from "styled-components";
import Card from "./Card";

const ProjectsContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
`;

const Reject = styled.div`
  flex: 1;
  background-color: red;
`;

const Accept = styled.div`
  flex: 1;
  background-color: green;
`;

const Deck = styled.div`
  flex: 1;
  background-color: black;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const Projects = ({ modal }) => {
  return (
    <ProjectsContainer>
      <Reject></Reject>
      <Deck>
        <Card img={"/vercel.svg"} container={modal} />
      </Deck>
      <Accept></Accept>
    </ProjectsContainer>
  );
};

export default Projects;
