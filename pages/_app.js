import React from 'react';
import '../styles/global.css'

const MyApp = ({ Component, pageProps }) => {
  return (
    <Component {...pageProps} />
  );
};

export default MyApp;
