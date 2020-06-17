import React from "react";
import Link from "next/link";
import Hamburger from "../components/Hamburger";

const Nav = (props) => {
  return (
    <nav>
      <style jsx>
        {`
          nav {
            border-bottom: 2px solid #e0e0e0;
            position: fixed;
            top: 0;
            right: 0;
            left: 0;
            height: 8vh;
            z-index: 1;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            padding: 0 15px;
            background-color: #fff;
          }

          .buttons {
            display: flex;
            flex-direction: row;
          }

          .nav-button {
            margin: 0 12px;
          }

          .nav-button:hover {
            color: #808080;
          }
        `}
      </style>
      <div style={{ cursor: "pointer" }} onClick={props.onClickLogo}>
        <h3>Aaron Goidel</h3>
      </div>

      {props.width > 550 ? (
        <div className="buttons">
          <div
            onClick={() => props.onClickLink(props.refs[0])}
            className="nav-button"
          >
            <h4>About Me</h4>
          </div>
          <div
            onClick={() => props.onClickLink(props.refs[1])}
            className="nav-button"
          >
            <h4>My Work</h4>
          </div>
          <div
            onClick={() => props.onClickLink(props.refs[2])}
            className="nav-button"
          >
            <h4>Résumé</h4>
          </div>
          <div
            onClick={() => props.onClickLink(props.refs[2])}
            className="nav-button"
          >
            <h4>Contact</h4>
          </div>
        </div>
      ) : (
        <Hamburger active={props.menuOpen} onClick={props.onClickMenuIcon} />
      )}
    </nav>
  );
};

export default Nav;
