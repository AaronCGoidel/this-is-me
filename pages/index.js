import Head from "next/head";
import Nav from "../components/Nav";
import Button from "../components/Button";

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>Aaron Goidel</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Nav />
      <div className="hero">
        <div className="hero-container">
          <div className="text-container">
            <span className="hero-text">
              This is the text for the landing page.
            </span>
          </div>
          <div className="buttons">
            <Button text={"About Me"} dest={""} />
            <Button text={"Projects"} dest={""} />
            <Button text={"CV - Contact"} dest={""} />
          </div>
        </div>
      </div>

      <style jsx>{`
        .container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .hero {
          display: flex;
          flex: 1;
          flex-direction: column;

          background-color: var(--background-dark);
          justify-content: center;
          align-items: center;
        }

        .hero-container {
          width: 37vw;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: stretch;
        }

        @media (max-width: 600px) {
          .hero-container {
            width: 100vw;
          }
        }

        .hero-text {
          font-family: Noto Sans;
          font-size: 4.5rem;
          line-height: 6.6rem;
          letter-spacing: 1px;
          font-size: 4.5rem;
          box-decoration-break: slice;
          color: #000;
          background: #fff;
          box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.35);
          border-radius: 5px;
          box-decoration-break: clone;
          padding: 0 0.2em;
        }

        @media (max-width: 1286px) {
          .hero-text {
            font-size: 3rem;
            line-height: 4.4rem;
          }
        }

        .text-container {
          margin: 0.5em;
        }

        .buttons {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
        }
      `}</style>

      <style jsx global>{`
        :root {
          --background-dark: #f2f2f2;
        }
        html {
          font-size: calc(1em + 0.2vw);
        }
        body {
          padding: 0;
          margin: 0;
        }

        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          font-family: "Libre Baskerville", serif;
          font-weight: normal;
        }

        p {
          font-family: "Noto Sans", sans-serif;
        }
      `}</style>
    </div>
  );
}
