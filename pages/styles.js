import styled, { keyframes } from "styled-components";
import colors from "../components/colors";

export const Main = styled.main`
  font-family: "Poppins", sans-serif;
  height: 100vh;
  width: 100vw;

  background-color: ${colors.main};
  color: ${colors.main};

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const wave = keyframes`
  0% {
    transform: translateX(-40%);
  }

  50% {
    text-shadow: 5px 20px 30px rgba(0, 0, 0, .9);
  }

  100% {
    transform: translateX(40%);
  }
`;

export const Letter = styled.span`
  animation: ${wave} 3s ease-in-out infinite;

  display: inline-block;
`;

let delays = "";

for (let i = 2; i <= 7; i++) {
  delays += `
    ${Letter}:nth-child(${i}) {
        animation-delay: ${0.5 * (i - 1)}s;
    }
    `;
}

export const Splash = styled.div`
  font-size: 3rem;
  line-height: 1.5;
  font-weight: bold;
  letter-spacing: 0.2em;

  ${delays};
`;

export const Buttons = styled.div`
  margin: 0.5rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;
