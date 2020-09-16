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
        <div className="info-container">
          <p className="tag read-time">
            ~{Math.ceil(props.blog.wcount / 200)} mim. read
          </p>
          <p className="tag date">{formatDate(props.blog.date)}</p>
        </div>
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
          text-align: center;
          cursor: pointer;
        }

        h3 {
          font-size: 1.5rem;
          font-weight: normal;
          margin: 0;
        }

        .info-container {
          // display: flex;
          // flex-direction: colxumn;
        }

        .info {
          // display: block;
          max-width: 400px;
        }

        .tag {
          font-weight: 500;
          font-size: 14px;
          display: inline-block;

          padding: 4px 12px;
        }

        .date {
          color: #fff;
          background-color: #8fd3f4;
          // background-image: linear-gradient(30deg, #84fab0 0%, #8fd3f4 100%);
          border-radius: 2px;

          margin-bottom: 0;
        }

        .read-time {
          // float: right;
        }
      `}
    </style>
    <style jsx global>
      {globalStyles}
    </style>
  </div>
);

export default PostListing;
