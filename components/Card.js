import React from "react";
import styled from "styled-components";
import colors from "./colors";
import { motion } from "framer-motion";

const CardContainer = styled(motion.div)`
  width: 10rem;
  height: 15rem;
  background-color: #fff;

  @media (max-width: 780px) {
    width: 12rem;
    height: 18rem;
  }

  padding: 0 0.5rem;

  border-radius: 18px;
  border: 1px solid #000;
`;

const Img = styled.img`
  width: 100%;
  height: 60%;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 1.5rem;
  //   padding: 0 0.5rem;
  color: #000;
`;

const Card = ({ img, title, container }) => {
  return (
    <CardContainer drag dragConstraints={container}>
      <Img src={img} />
      <Title>foo</Title>
    </CardContainer>
  );
};

export default Card;
