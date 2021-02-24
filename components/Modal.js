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

  background: rgba(0, 0, 0, 0.4);
`;

const ModalContainer = styled(motion.div)`
  width: ${({ full }) => (full ? "100vw" : "70vw")};
  height: ${({ full }) => (full ? "100vh" : "80vh")};

  background-color: white;

  ${({ full }) =>
    !full &&
    `
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -40vh;
  margin-left: -35vw;

  border-radius: 18px;
  `}

  @media (max-width: 780px) {
    width: 100vw;
    height: 100vh;
    position: static;
    margin: 0;
    border-radius: 0;
  }
`;

const CloseButton = styled.svg`
  width: 25px;
  height: 25px;

  position: absolute;
  right: 18px;
  top: 18px;

  cursor: pointer;
`;

const CloseBtn = ({ handleClose }) => (
  <CloseButton onClick={handleClose} viewBox="0 0 20 20">
    <title>close</title>
    <line
      x1="18"
      y1="18"
      x2="2"
      y2="2"
      fill="none"
      stroke={colors.main}
      strokeLinecap="round"
      strokeMiterlimit="10"
      strokeWidth="3"
    />
    <line
      x1="2"
      y1="18"
      x2="18"
      y2="2"
      fill="none"
      stroke={colors.main}
      strokeLinecap="round"
      strokeMiterlimit="10"
      strokeWidth="3"
    />
  </CloseButton>
);

const Modal = ({ handleClose, children, open, full, modalRef }) => {
  const modalIn = {
    scaleX: [0, 0.5, 1],
    scaleY: [0, 0.001, 1],
    // rotate: [-40, -20, 0],
  };

  return (
    <AnimatePresence>
      {open && (
        <Overlay initial={"initial"} animate={"open"} exit={"exit"}>
          <ModalContainer
            ref={modalRef}
            full={full}
            animate={modalIn}
            exit={{
              scaleX: [1, 0.5, 0],
              scaleY: [1, 0.001, 0],
              // rotate: [0, -20, -40],
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
