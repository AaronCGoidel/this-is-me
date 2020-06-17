import React from "react";
import Projects from "./Projects";

const ProjectItem = (props) => (
  <div className="item">
    <img className="thumbnail" />
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
          align-items: center;
          width: 70vw;
        }

        .thumbnail {
          width: 20vw;
          height: 212px;
          background-color: #c4c4c4;
        }

        .text {
          width: 45vw;
          margin: 0 1vw;
        }

        @media (max-width: 700px) {
          .item {
            width: 88vw;
          }
          .text {
            width: 100vw;
          }
          .thumbnail {
            width: 100vw;
          }
        }
      `}
    </style>
  </div>
);

export default ProjectItem;
