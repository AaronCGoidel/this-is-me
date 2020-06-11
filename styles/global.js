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
    // margin: 1vh 0;
    display: flex;
    height: 100vh;
  }
`;
