import React, { useEffect, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";
import colors from "./colors";

const Button = styled.a`
  font-size: 1.2rem;
  font-weight: bold;
  color: ${colors.light};
  margin: 2rem;

  cursor: pointer;

  border-bottom: 0.1rem solid ${colors.light};

  transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);

  &:hover {
    color: ${colors.main};
    box-shadow: inset 0 -60px 0 0 ${colors.light};
    border-bottom: none;
  }
`;

const HeroButton = (props) => {
  const button = useRef();

  useEffect(() => {}, []);

  return (
    <Button onClick={props.onClick} ref={button} onMouseEnter={() => {}}>
      {props.children}
    </Button>
  );
};

export default HeroButton;
