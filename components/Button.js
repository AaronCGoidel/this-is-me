import React from "react";
import Link from "next/link";

const Button = (props) => (
  <a
    className={`button grow ${props.secondary ? "secondary" : ""} ${
      props.hero ? "in-hero" : ""
    }`}
    onClick={props.onClick}
    href={props.href ? props.href : null}
  >
    {props.children}
    <p>{props.text}</p>
    <style jsx>{`
      .button {
        text-decoration: none;
        display: block;
        cursor: pointer;
        background-color: #fff;
        transition-duration: 0.4s;
        text-align: center;
        padding: 0.5vh 0.8vw;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        width: 150px;
        margin: 20px;
      }

      .grow {
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
        white-space: nowrap;
        margin: 10px 0;
      }

      .in-hero {
        margin: 0;
        padding: 0.5vh 2vw;
        flex: 0.3 0.3 0px;
      }

      .secondary {
        color: #fff;
        background-color: #000;
      }
    `}</style>
  </a>
);

export default Button;
