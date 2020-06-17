import React from "react";
import Projects from "./Projects";

const ProjectItem = (props) => (
  <div className="item">
    <div className="thumbnail" />
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
        }

        .thumbnail {
          width: 270px;
          height: 212px;
          background-color: #c4c4c4;
        }

        .text {
          width: 50vw;
          margin: 0 1vw;
        }

        @media (max-width: 700px) {
          .text {
            width: 100vw;
          }
          .thumbnail {
            flex: 1;
          }
        }
      `}
    </style>
  </div>
);

export default ProjectItem;
