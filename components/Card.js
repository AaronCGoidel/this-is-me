import React, { useEffect } from "react";
import styled from "styled-components";
import colors from "./colors";
import { motion, useMotionValue, useTransform } from "framer-motion";

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
  user-drag: none;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 1.5rem;
  //   padding: 0 0.5rem;
  color: #000;
`;

const Card = ({ img, title, container }) => {
  const x = useMotionValue(0);
  const input = [0, 400, 800];
  const output = ["#ff0000", "#fff", "#00ff00"];
  const background = useTransform(x, input, output);

  return (
    <CardContainer
      drag={"x"}
      dragConstraints={container}
      style={{ x, background }}
    >
      <Img src={img} />
      <Title>foo</Title>
    </CardContainer>
  );
};

export default Card;
