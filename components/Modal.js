import React from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import colors from "./colors";

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;

  width: 100%;
  height: 100%;

  z-index: 1;
`;

const ModalContainer = styled(motion.div)`
  width: 100vw;
  height: 100vh;

  background-color: white;

  transform: translate(-50%, -50%);
`;

const CloseButton = styled.svg`
  width: 20px;
  height: 20px;

  position: absolute;
  right: 18px;
  top: 18px;

  cursor: pointer;
`;

const CloseBtn = ({ handleClose }) => (
  <CloseButton onClick={handleClose} viewBox="0 0 20.39 20.39">
    <title>close</title>
    <line
      x1="19.39"
      y1="19.39"
      x2="1"
      y2="1"
      fill="none"
      stroke={colors.main}
      strokeLinecap="round"
      strokeMiterlimit="10"
      strokeWidth="2"
    />
    <line
      x1="1"
      y1="19.39"
      x2="19.39"
      y2="1"
      fill="none"
      stroke={colors.main}
      strokeLinecap="round"
      strokeMiterlimit="10"
      strokeWidth="2"
    />
  </CloseButton>
);

const Modal = ({ handleClose, children, isOpen }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <Overlay initial={"initial"} animate={"isOpen"} exit={"exit"}>
          <ModalContainer
            animate={{
              scaleX: [0, 0.75, 1],
              scaleY: [0, 0.001, 1],
              borderRadius: [40, 12, 0],
            }}
            exit={{
              scaleX: [1, 0.75, 0],
              scaleY: [1, 0.001, 0],
              borderRadius: [0, 12, 40],
            }}
          >
            <CloseBtn handleClose={handleClose} />
            {children}
          </ModalContainer>
        </Overlay>
      )}
    </AnimatePresence>
  );
};

export default Modal;
