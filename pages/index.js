import Head from "next/head";
import { useEffect, useState } from "react";
import HeroButton from "../components/HeroButton";
import Modal from "../components/Modal";
import { Main, Splash, Letter, Buttons } from "./styles";

const WaveText = ({ text }) => (
  <Splash>
    {[...text].map((letter) => {
      return <Letter key={letter}>{letter}</Letter>;
    })}
  </Splash>
);

export default function Home() {
  const [modalOpen, setModalOpen] = useState(0);

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
        <Modal
          isOpen={modalOpen}
          handleClose={() => {
            setModalOpen(0);
          }}
        ></Modal>

        <WaveText text={"Aaron"} />
        <WaveText text={"Goidel"} />
        <Buttons>
          <HeroButton
            onClick={() => {
              setModalOpen(1);
            }}
          >
            About
          </HeroButton>
          <HeroButton
            onClick={() => {
              setModalOpen(2);
            }}
          >
            Work
          </HeroButton>
        </Buttons>
      </Main>
    </div>
  );
}
