import Head from "next/head";
import Nav from "../components/Nav";
import globalStyles from "../styles/global.js";
import { useState } from "react";

export default function Projects() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="container">
      <Head>
        <title>Projects | Aaron Goidel</title>
      </Head>
      <Nav onClickMenuIcon={() => setMenuOpen(!menuOpen)} menuOpen={menuOpen} />
      <style jsx global>
        {globalStyles}
      </style>
    </div>
  );
}
