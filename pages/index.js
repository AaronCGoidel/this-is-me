import Head from "next/head";
import Nav from "../components/Nav";
import Button from "../components/Button";
import globalStyles from "../styles/global.js";
import { useState, useEffect } from "react";
import Hero from "../components/Hero";

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.listener = null;
    this.state = {
      scrollStatus: "hero",
      menuOpen: false,
    };
  }

  componentDidMount() {
    this.io = new IntersectionObserver(
      (entries) => {
        console.log(entries);
      },
      { threshold: 1.0 }
    );
    const elements = Array.from(document.querySelectorAll(".section"));
    // elements.forEach((element) => this.io.observe(element));
    this.io.observe(elements[1]);
  }

  render() {
    return (
      <div className="container">
        <Head>
          <title>Aaron Goidel</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Nav
          onClickMenuIcon={() =>
            this.setState({ menuOpen: !this.state.menuOpen })
          }
          menuOpen={this.state.menuOpen}
          loc={this.state.scrollStatus}
        />

        <div className="parallax-wrapper">
          <Hero />

          {/* ABOUT ME */}
          <div className="section">
            <h1>Hello, World.</h1>
          </div>
        </div>

        {/* STYLE */}
        <style jsx>{`
          .parallax-wrapper {
            height: 100vh;
            overflow-x: hidden;
            overflow-y: auto;
            perspective: 2px;
          }
        `}</style>

        <style jsx global>
          {globalStyles}
        </style>
      </div>
    );
  }
}
