import { motion } from "framer-motion";
import React, { useRef, useState } from "react";
import styled from "styled-components";
import Card from "./Card";
import Stack from "./Stack";

const ProjectsContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
`;

const Item = styled.div`
  background: #fff;
  width: 300px;
  height: 425px;

  display: flex;

  font-size: 80px;
  text-shadow: 0 10px 10px #d1d5db;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  border-radius: 8px;

  transform: ${() => {
    let rotation = Math.random() * (5 - -5) + -5;
    return `rotate(${rotation}deg)`;
  }};
`;

const Deck = styled(Stack)`
  width: 210px;
  background-color: red;
`;

const Projects = () => {
  const deck = useRef(null);
  const [status, setStatus] = useState(0);
  return (
    <ProjectsContainer>
      <Deck handleVote={(item, vote) => console.log(item.props, vote)}>
        <Item data-value="waffles">🧇</Item>
        <Item data-value="pancakes">🥞</Item>
        <Item data-value="donuts">🍩</Item>
      </Deck>
    </ProjectsContainer>
  );
};

export default Projects;
