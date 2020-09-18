import React, { useEffect, useState } from "react";
import Head from "next/head";
import PostListing from "../../components/PostListing";
import useScrollPosition from "../../lib/scrollHook";
import BackArrow from "../../components/BackArrow";

function BlogIndex(props) {
  const scrollPos = useScrollPosition();
  const [darkMode, setDarkMode] = useState(false);
  return (
    <div className="blog">
      <Head>
        <title>Blog | Aaron Goidel</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="wrapper">
        <nav>
          <BackArrow link={"/"} text={"Home"} />
        </nav>
        <div
          className="section padded hero"
          style={{
            top: `${scrollPos / 2}px`,
            opacity: `${1 - scrollPos / 240}`,
          }}
        >
          <p style={{ color: "#8fd3f4" }}>Aaron Goidel</p>
          <h1>
            The Untitled
            <br /> Blog
          </h1>
        </div>
        <div className="blog-content section">
          {props.blogs.map((blog, idx) => {
            return (
              <PostListing
                key={blog.id}
                blog={blog}
                params={{ dark: darkMode }}
              />
            );
          })}
        </div>
      </div>
      <style jsx>{`
        .blog {
          min-height: 100vh;
          background: #fff;
        }
        nav {
          width: 100%;
          height 4rem;
          position: fixed;
          z-index: 4;
        }

        .wrapper {
          display: block;
          padding-bottom: 6rem;
        }

        .section {
          padding: 0;
          text-align: center;

          width: 100%;
        }

        .padded {
          padding: 140px 0rem 100px;
        }

        .hero {
          position: relative;
        }

        .blog-content {
          position: relative;

          z-index: 2;
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

        :global(html) {
          ${darkMode ? "filter: invert(1) hue-rotate(-50deg);" : ""}
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
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
  return {
    props: { blogs },
  };
}

export default BlogIndex;
