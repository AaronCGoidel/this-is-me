import React from "react";
import globalStyles from "../styles/global.js";

const Menu = (props) => (
  <div className={`menu overlay ${props.open ? "open" : ""}`}>
    <h1>Menu</h1>
    <h2 onClick={() => props.onClick(props.refs[0])}>About Me</h2>
    <h2 onClick={() => props.onClick(props.refs[1])}>My Projects</h2>
    <h2 onClick={() => props.onClick(props.refs[2])}>Résumé</h2>
    <style jsx>{`
      .menu {
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        justify-content: center;
        align-items: center;

        color: white;
        // padding: 20vh 0;
        width: 0;
        height: 100vh;
      }

      .open {
        width: 100vw;
      }

      h1:after {
        content: " ";
        display: block;
        border: 2px solid white;
      }

      h2 {
        cursor: pointer;
      }

      .overlay {
        position: fixed;
        z-index: 1;
        left: 0;
        top: 0;
        background-color: rgb(0, 0, 0);
        background-color: #ffd0aef8;
        transition: 0.5s;
        // transition-delay: .5s;
        overflow-x: hidden;
      }
    `}</style>
    <style jsx global>
      {globalStyles}
    </style>
  </div>
);

export default Menu;
