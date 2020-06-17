import css from "styled-jsx/css";

export default css.global`
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

  .container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .section {
    padding: 0 4vw;
    display: flex;
    min-height: 100vh;
    background-color: #fff;
    display: flex;
    flex-direction: column;
  }

  @mixin hideTapHighlightColor() {
    //Prevent highlight color when element is tapped
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }

  @mixin hardwareAccel() {
    //Improve performance on mobile/tablet devices
    transform: translateZ(0);
  }

  @mixin improveAntiAlias() {
    //Improve aliasing on mobile/tablet devices
    box-shadow: 0 0 1px rgba(0, 0, 0, 0);
  }

  .overlay {
    width: 100vw;
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    background-color: rgb(0, 0, 0);
    background-color: rgba(0, 0, 0, 0.9);
    transition: 0.5s;
    // transition-delay: .5s;
    overflow-x: hidden;
  }

  .section h1 {
    font-size: 4em;
    margin: 0;
  }

  .heading {
    position: relative;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0) 50%,
      #ffd0ae 50%
    );
    display: inline;
    margin: 0;
    width: 40vw;
  }

  @media (max-width: 1024px) {
    .section h1 {
      font-size: 2.3em;
    }

    .heading {
      width: 70vw;
    }
  }
`;
