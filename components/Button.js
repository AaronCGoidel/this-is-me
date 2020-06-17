import React from "react";
import Link from "next/link";

const Button = (props) => (
  <div className="button grow" onClick={props.onClick}>
    <p>{props.text}</p>
    <style jsx>{`
      .button {
        cursor: pointer;
        background-color: #fff;
        transition-duration: 0.4s;
        flex: 0.3 0.3 0px;
        text-align: center;
        padding: 0.5vh 2vw;
      }

      .grow {
        display: inline-block;
        transition-duration: $defaultDuration;
        transition-property: transform;

        @include hideTapHighlightColor();
        @include hardwareAccel();
        @include improveAntiAlias();
      }

      .grow:hover,
      .grow:focus,
      .grow:active {
        transform: scale(1.08);
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
