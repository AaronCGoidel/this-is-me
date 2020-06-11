import Button from "../components/Button";
import globalStyles from "../styles/global.js";

const Hero = (props) => (
  <div ref={props.heroRef} className="section hero parallax">
    <div className="hero-container">
      <div className="text-container">
        <span className="hero-text">
          This is the text for the landing page.
        </span>
      </div>
      <div className="buttons">
        <Button
          text={"About Me"}
          onClick={() => props.onClick(props.refs[0])}
        />
        <Button
          text={"Projects"}
          onClick={() => props.onClick(props.refs[1])}
        />
        <Button
          text={"CV - Contact"}
          onClick={() => props.onClick(props.refs[2])}
        />
      </div>
    </div>
    <style jsx>{`
      .parallax::after {
        content: " ";
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;

        // transform: translateZ(-1px) scale(1.5);
        background-attachment: fixed;
        background-size: 100%;

        z-index: -1;
      }

      .hero {
        justify-content: center;
        align-items: center;
      }

      .hero::after {
        background-color: var(--background-dark);
        background-image: url("https://placekitten.com/g/1000/800");

        background-repeat: no-repeat;
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
        .hero::after {
          background-image: url("https://placekitten.com/g/400/1000");
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

    <style jsx global>
      {globalStyles}
    </style>
  </div>
);

export default Hero;
