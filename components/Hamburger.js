import React from "react";

const Hamburger = (props) => (
  <div
    className={`menu-button-container ${props.active ? "active" : ""}`}
    onClick={props.onClick}
  >
    <div className={`bar1 ${props.light ? "light" : ""}`} />
    <div className={`bar2 ${props.light ? "light" : ""}`} />
    <div className={`bar3 ${props.light ? "light" : ""}`} />
    <style jsx>{`
      .menu-button-container {
        cursor: pointer;
      }

      .bar1,
      .bar2,
      .bar3 {
        width: 29px;
        height: 2px;
        background-color: #000;
        margin: 7px 0;
        transition: 0.4s;
      }

      .light {
        background-color: #fff;
      }

      .active .bar1 {
        transform: rotate(-45deg) translate(-5px, 5px);
        // transform: translate(0, 9px);
      }

      .active .bar2 {
        opacity: 0;
      }

      .active .bar3 {
        transform: rotate(45deg) translate(-8px, -8px);
        // transform: translate(0, -9px);
      }
    `}</style>
  </div>
);

export default Hamburger;
