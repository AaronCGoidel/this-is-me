import React, { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

import Card from "./Card";

const Frame = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const Stack = ({ children, handleVote, ...props }) => {
  const [stack, setStack] = useState(React.Children.toArray(children));

  const pop = (arr) => {
    return arr.filter((_, idx) => {
      return idx < arr.length - 1;
    });
  };

  const castVote = (elt, vote) => {
    let updatedStack = pop(stack);
    setStack(updatedStack);

    handleVote(elt, vote);
  };

  return (
    <Frame {...props}>
      {stack.map((item, index) => {
        let onTop = index === stack.length - 1;
        return (
          <Card
            drag={onTop}
            key={item.key || index}
            handleVote={(res) => castVote(item, res)}
          >
            {item}
          </Card>
        );
      })}
    </Frame>
  );
};

export default Stack;
