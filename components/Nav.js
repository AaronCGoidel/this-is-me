import React from "react";
import Link from "next/link";
import Hamburger from "../components/Hamburger";

const Nav = (props) => (
  <nav>
    <style jsx>
      {`
        nav {
          z-index: 1;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          padding: 0 15px;
          box-shadow: 0px 0px 4px 1px rgba(0, 0, 0, 0.45);
        }
      `}
    </style>
    <Link href="/">
      <h3 style={{ cursor: "pointer" }}>Aaron Goidel</h3>
    </Link>
    <Hamburger active={props.menuOpen} onClick={props.onClickMenuIcon} />
  </nav>
);

export default Nav;
