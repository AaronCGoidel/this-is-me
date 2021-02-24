import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import HeroButton from "../components/HeroButton";
import Modal from "../components/Modal";
import Card from "../components/Card";
import { Main, Splash, Letter, Buttons } from "./styles";

const WaveText = ({ text }) => (
  <Splash>
    {[...text].map((letter) => {
      return <Letter key={letter}>{letter}</Letter>;
    })}
  </Splash>
);

export default function Home() {
  const [modalState, setModalState] = useState(0);
  const modal = useRef(null);
  const pages = [];
  return (
    <div>
      <Head>
        <title>Aaron Goidel</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <Main>
        <WaveText text={"Aaron"} />
        <WaveText text={"Goidel"} />
        <Buttons>
          <HeroButton
            onClick={() => {
              setModalState(1);
            }}
          >
            About
          </HeroButton>
          <HeroButton
            onClick={() => {
              setModalState(2);
            }}
          >
            Work
          </HeroButton>
        </Buttons>

        <Modal
          modalRef={modal}
          full={modalState == 1}
          open={modalState}
          handleClose={() => {
            setModalState(0);
          }}
        >
          <Card img={"/vercel.svg"} container={modal} />
        </Modal>
      </Main>
    </div>
  );
}
