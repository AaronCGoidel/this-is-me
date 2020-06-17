import React from "react";
import Projects from "./Projects";

const ProjectItem = (props) => (
  <a className="item" href={props.link ? props.link : null}>
    <img className="thumbnail" src={props.img} />
    <div className="text">
      <h2>{props.title}</h2>
      <p>{props.blurb}</p>
    </div>
    <style jsx>
      {`
        .item {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          margin: 10px;
          padding: 10px;
          align-items: center;
          width: 70vw;
          // border-radius: 5px;
          // border: 1px solid #000;
          text-decoration: none;
          color: #000;
        }

        .thumbnail {
          border-radius: 5px;
          width: 20vw;
          height: 12vw;
          background-color: #c4c4c4;
        }

        .text {
          width: 45vw;
          margin: 0 15px;
        }

        @media (max-width: 700px) {
          .item {
            width: 88vw;
            margin: 100px 0;
            flex-direction: column;
            // align-items: center;
            justify-content: center;
          }
          .text {
            width: 80vw;
          }
          .thumbnail {
            width: 80vw;
            height: 48vw;
          }
        }
      `}
    </style>
  </a>
);

export default ProjectItem;
