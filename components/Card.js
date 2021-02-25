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

  box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px,
    rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px,
    rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
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

const Card = ({ img, title, container, update }) => {
  const x = useMotionValue(0);
  const input = [-200, 0, 200];
  const output = ["#ff0000", "#fff", "#00ff00"];
  const background = useTransform(x, input, output);

  const rotation = [-8, 0, 8];
  const tilt = [-5, 0, 5];
  const rotate = useTransform(x, input, rotation);
  const rotateY = useTransform(x, input, tilt);

  useEffect(
    () =>
      x.onChange((latest) => {
        let dist = x.get();
        if (dist < -120) {
          update(2);
        } else if (dist > 120) {
          update(1);
        } else {
          update(0);
        }
      }),
    []
  );

  return (
    <CardContainer
      drag={"x"}
      dragConstraints={container}
      dragElastic={0.8}
      style={{ x, rotateY, rotate }}
      whileDrag={{ rotateX: 20 }}
      onDragEnd={() => {
        let dist = x.get();
        if (dist < -120) {
        } else if (dist > 120) {
        } else {
        }
      }}
    >
      <Img src={img} />
      <Title>foo</Title>
    </CardContainer>
  );
};

export default Card;
