import React from "react";
import Link from "next/link";
import globalStyles from "../styles/global.js";

let formatDate = (str) => {
  let d = new Date(str);
  return d.toDateString();
};

const PostListing = (props) => (
  <div className="listing-container">
    <Link href={`/blog/posts/${props.blog.slug}`}>
      <div className="listing">
        <h3>{props.blog.title}</h3>
        {/* <p>{props.blog.desc}</p> */}
        <p className="date">{formatDate(props.blog.date)}</p>
      </div>
    </Link>

    <style jsx>
      {`
        .listing-container {
          display: flex;
          justify-content: center;
          margin-bottom: 1rem;
        }

        .listing-container:not(:first-child) {
          margin-top: 4rem;
        }

        .listing {
          position: relative;
          display: inline-block;
          text-align: center;
          cursor: pointer;
        }

        h3 {
          font-size: 1.5rem;
          margin: 0;
        }

        .date {
          position: relative;
          font-weight: 500;
          font-size: 14px;
          display: inline-block;

          padding: 4px 12px;
          background-color: var(--accent);
          border-radius: 2px;

          margin-bottom: 0;
        }
      `}
    </style>
    <style jsx global>
      {globalStyles}
    </style>
  </div>
);

export default PostListing;
