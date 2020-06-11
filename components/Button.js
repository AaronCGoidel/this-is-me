import React from "react";
import Link from "next/link";

const Button = (props) => (
  <div className="button" onClick={props.onClick}>
    <p>{props.text}</p>
    <style jsx>{`
      .button {
        cursor: pointer;
        background-color: #fff;
        box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.35);
        transition-duration: 0.4s;
        border-radius: 5px;
        flex: 1 1 0px;
        margin: 0.25em 0.5em;
        text-align: center;
        padding: 0.5vh 2vw;
      }

      .button:hover,
      .button:focus,
      .button:active {
        box-shadow: 0px 4px 7px 0px rgba(0, 0, 0, 0.55);
      }

      p {
        font-style: normal;
        color: #000000;
        white-space: nowrap;
        margin: 10px 0;
      }
    `}</style>
  </div>
);

export default Button;
