import { ST } from "next/dist/next-server/lib/utils";
import React, { useRef, useState } from "react";
import styled from "styled-components";
import Card from "./Card";

const ProjectsContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
`;

const Reject = styled.div`
  flex: 1;
  //   background-color: red;
`;

const Accept = styled.div`
  flex: 1;
  //   background-color: green;
`;

const Deck = styled.div`
  flex: 0;
  //   background-color: black;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Stamp = styled.span`
  position: absolute;

  color: #555;
  font-size: 2rem;
  font-weight: 700;
  border: 0.25rem solid #555;
  display: inline-block;
  padding: 0.25rem 1rem;
  text-transform: uppercase;
  border-radius: 1rem;
  font-family: "Courier";
  -webkit-mask-image: url("https://s3-us-west-2.amazonaws.com/s.cdpn.io/8399/grunge.png");
  -webkit-mask-size: 944px 604px;
  mix-blend-mode: multiply;
  top: 50px;

  ${({ accept }) =>
    accept &&
    `
    transform: rotate(12deg);
    border-color: green;
    color: green;

    right: 20px;
  `}

  ${({ decline }) =>
    decline &&
    `
    transform: rotate(-15deg);
    border-color: red;
    color: red;
    left: 20px;
  `}
`;

const Hint = styled.span`
  font-size: 1.2rem;
  position: absolute;
  bottom: 5vh;
`;

const Projects = () => {
  const deck = useRef(null);
  const [status, setStatus] = useState(0);
  return (
    <ProjectsContainer>
      <Reject></Reject>
      <Deck ref={deck}>
        {status == 1 && <Stamp accept>Read More</Stamp>}

        {status == 2 && <Stamp decline>Maybe Later</Stamp>}
        <Card img={"/vercel.svg"} container={deck} update={setStatus} />
        <Hint>Drag Me</Hint>
      </Deck>
      <Accept></Accept>
    </ProjectsContainer>
  );
};

export default Projects;
