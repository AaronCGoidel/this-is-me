import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { motion, useAnimation, useMotionValue } from "framer-motion";

const CardContainer = styled(motion.div)`
  position: absolute;
  ${({ top }) =>
    top &&
    `cursor: grab;
  &:active {
    cursor: grabbing;`}
`;

const Card = ({ children, style, handleVote, id, top, first, ...props }) => {
  const cardRef = useRef(null);

  const x = useMotionValue(0);
  const controls = useAnimation();

  const [vote, setVote] = useState(undefined);
  const [bounded, setBounded] = useState(true);

  const [dir, setDir] = useState();
  const [vel, setVel] = useState();

  const getVote = (child, parent) => {
    const card = child.getBoundingClientRect();
    const box = parent.getBoundingClientRect();

    if (card.left > box.right) {
      return true;
    } else if (card.right < box.left) {
      return false;
    }
    return undefined;
  };

  const getDir = () => {
    return vel >= 1 ? "right" : vel <= -1 ? "left" : undefined;
  };

  const setHeading = () => {
    setVel(x.getVelocity());
    setDir(getDir());
  };

  useEffect(() => {
    const unSubX = x.onChange(() => {
      const child = cardRef.current;
      const parent = child.parentNode;

      const res = getVote(child, parent);

      res !== undefined && handleVote(res);
    });

    return () => unSubX();
  });

  return (
    <CardContainer
      top={top}
      ref={cardRef}
      dragConstraints={bounded && { left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={1}
      style={{ x }}
      onDrag={setHeading}
      animate={(controls, first && { x: [0, -150, -150, 0, 0, 150, 150, 0] })}
      transition={{ duration: 5, delay: 1 }}
      // onDragEnd={}
      whileTap={{ scale: 1.1 }}
      {...props}
    >
      {children}
    </CardContainer>
  );
};

export default Card;
