import React from "react";
import "../styles/global.css";
import { Analytics } from "@vercel/analytics/react";

const MyApp = ({ Component, pageProps }) => {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
};

export default MyApp;
