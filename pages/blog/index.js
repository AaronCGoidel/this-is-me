import React from "react";
import Link from "next/link";
import PostListing from "../../components/PostListing";
import useScrollPosition from "../../lib/scrollHook";

function BlogIndex(props) {
  const scrollPos = useScrollPosition();
  return (
    <div className="wrapper">
      <div className="group">
        <div
          className="section padded background"
          style={{
            opacity: `${1 - scrollPos / 10}`,
          }}
        >
          <p>Blog</p>
          <h1>
            Blog title
            <br /> here
          </h1>
        </div>
        <div className="blog-content section foreground">
          {props.blogs.map((blog, idx) => {
            return <PostListing key={blog.id} blog={blog} />;
          })}
        </div>
      </div>

      <style jsx>{`
        div {
          box-sizing: border-box;
        }

        .group {
          position: relative;
          transform-style: preserve-3d;
        }

        .background {
          transform: translateZ(-1px) scale(2);
          top: calc(250px - 50vh);
          position: absolute;
        }

        .foreground {
          position: absolute;
        }

        .wrapper {
          height: 100vh;
          overflow-x: hidden;
          overflow-y: auto;
          perspective: 1px;
        }

        .section {
          padding: 0;
          text-align: center;
          overflow: hidden;
          position: relative;
          width: 100%;
          display: block;
        }

        .padded {
          padding: 140px 0 100px 0;
        }

        p {
          font-size: 22px;
          margin-top: 0;
          margin-bottom: 1rem;
        }

        h1 {
          margin: 0;
          padding: 0;
          font-size: 5rem;
          font-weight: 300;
          line-height: 1.1;
        }
      `}</style>
    </div>
  );
}

export async function getStaticProps() {
  const fs = require("fs");
  const matter = require("gray-matter");
  const { v4: uuid } = require("uuid");

  const files = fs.readdirSync(`${process.cwd()}/pages/blog/posts`, "utf-8");

  const blogs = files
    .filter((fn) => fn.endsWith(".md"))
    .map((fn) => {
      const path = `${process.cwd()}/pages/blog/posts/${fn}`;
      const rawContent = fs.readFileSync(path, {
        encoding: "utf-8",
      });
      const { data } = matter(rawContent);
      return { ...data, id: uuid() };
    });

  return {
    props: { blogs },
  };
}

export default BlogIndex;
