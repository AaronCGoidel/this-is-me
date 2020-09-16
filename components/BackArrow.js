import React from "react";
import Link from "next/link";

const BackArrow = (props) => (
  <Link href="/">
    <div className="arrow-container">
      <svg className="arrow" width="1.5rem" height="1.5rem" viewBox="0 0 50 80">
        <polyline
          fill="none"
          stroke="#000000"
          stroke-width="1"
          stroke-linecap="round"
          stroke-linejoin="round"
          points="45.63,75.8 0.375,38.087 45.63,0.375 "
        />
      </svg>
      <h3>Back</h3>
      <style jsx>{`
        .arrow-container {
          display: flex;
          align-items: center;
          cursor: pointer;
          width: 8rem;
        }
        svg {
          padding: 5px;
        }

        .arrow {
        }

        polyline {
          transition: all 250ms ease-in-out;
        }

        h3 {
          color: #949494;
          transition: all 250ms ease-in-out;
        }

        .arrow-container:hover polyline,
        .arrow-container:focus polyline {
          stroke-width: 3;
        }

        .arrow-container:hover h3,
        .arrow-container:focus h3 {
          color: #000;
        }
      `}</style>
    </div>
  </Link>
);

export default BackArrow;
