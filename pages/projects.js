import Head from "next/head";
import Nav from "../components/Nav";
import globalStyles from "../styles/global.js";

export default function Projects() {
  return (
    <div className="container">
      <Head>
        <title>Projects | Aaron Goidel</title>
      </Head>
      <Nav />
      <style jsx global>
        {globalStyles}
      </style>
    </div>
  );
}
