import Button from "../components/Button";
import globalStyles from "../styles/global.js";

const Hero = (props) => (
  <div ref={props.heroRef} className="hero parallax">
    <div className="backdrop" />
    <div className="hero-container">
      <div className="text-container">
        <span className="hero-text">
          Hi. My name is Aaron and I build websites.
        </span>
      </div>
      <div className="buttons">
        <Button
          text={"About Me"}
          onClick={() => props.onClick(props.refs[0])}
        />
        <Button text={"My Work"} onClick={() => props.onClick(props.refs[1])} />
        <Button text={"Résumé"} onClick={() => props.onClick(props.refs[2])} />
      </div>
    </div>

    <style jsx>{`
      .backdrop {
        content: " ";
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;

        background-image: url("/BG.jpg");
        background-repeat: no-repeat;

        background-attachment: fixed;
        background-size: cover;

        z-index: -1;
      }

      .hero {
        justify-content: center;
        align-items: center;

        padding: 0 4vw;
        display: flex;
        height: 100vh;
      }

      .hero-container {
        width: 37vw;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: stretch;
        position: relative;
        z-index: 1;
      }

      .hero-text {
        font-family: Noto Sans;
        line-height: 6.6rem;
        letter-spacing: 1px;
        font-size: 4.2rem;
        box-decoration-break: slice;
        color: #000;
        background: #fff;
        box-decoration-break: clone;
        padding: 0 0.2em;
      }

      @media (max-width: 1286px) {
        .hero-text {
          font-size: 3.4rem;
          line-height: 5.3rem;
        }

        .hero-text {
          font-size: 2.6rem;
          line-height: 4.1rem;
        }

        .hero-container {
          width: 100vw;
        }
      }

      .buttons {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        margin: 1em 0;
      }

      @media (max-width: 600px) {
        .backdrop {
          background-position: -300px 0;
        }
      }
    `}</style>

    <style jsx global>
      {globalStyles}
    </style>
  </div>
);

export default Hero;
