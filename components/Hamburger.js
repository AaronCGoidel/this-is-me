import React from "react";

const Hamburger = (props) => (
  <div
    className={`menu-button-container ${props.active ? "active" : ""}`}
    onClick={props.onClick}
  >
    <div className="bar1" />
    <div className="bar2" />
    <div className="bar3" />
    <style jsx>{`
      .menu-button-container {
        cursor: pointer;
      }

      .bar1,
      .bar2,
      .bar3 {
        border-radius: 5px;
        width: 29px;
        height: 4px;
        background-color: #000;
        margin: 5px 0;
        transition: 0.4s;
      }

      .active .bar1 {
        transform: rotate(-45deg) translate(-5px, 5px);
      }

      .active .bar2 {
        opacity: 0;
      }

      .active .bar3 {
        transform: rotate(45deg) translate(-8px, -8px);
      }
    `}</style>
  </div>
);

export default Hamburger;
