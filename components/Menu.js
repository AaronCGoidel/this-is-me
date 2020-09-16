import React from "react";
import globalStyles from "../styles/global.js";

const Menu = (props) => (
  <div className={`menu overlay ${props.open ? "open" : ""}`}>
    <div className="heading">
      <h1>Menu</h1>
    </div>
    {props.refs.map((ref, idx) => {
      return <h2 onClick={() => props.onClick(ref.link)}>{ref.name}</h2>;
    })}
    <style jsx>{`
      h1 {
        margin: 0;
      }
      h2 {
        padding: 0 10px;
      }
      .heading {
        width: 50vw;
      }
      .menu {
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;

        padding: 20vh 5vw;
        width: 100vw;
        height: 100vh;

        transform-origin: 0% 0%;
        transform: translate(100%, 0);

        transition: transform 0.5s cubic-bezier(0.77, 0.2, 0.05, 1);
      }

      .open {
        transform: translate(0, 0);
      }

      h2 {
        cursor: pointer;
      }

      .overlay {
        position: fixed;
        z-index: 1;
        left: 0;
        top: 0;
        background-color: #fff;
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
