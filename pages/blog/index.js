import React from "react";
import Head from "next/head";
import Link from "next/link";
import PostListing from "../../components/PostListing";
import useScrollPosition from "../../lib/scrollHook";

function BlogIndex(props) {
  const scrollPos = useScrollPosition();
  return (
    <div>
      <Head>
        <title>Blog | Aaron Goidel</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div id="wrapper" className="wrapper">
        <div
          id="head"
          className="section padded hero"
          style={{
            top: `${scrollPos / 2}px`,
            opacity: `${1 - scrollPos / 240}`,
          }}
        >
          <p>Blog</p>
          <h1>
            Blog title
            <br /> here
          </h1>
        </div>
        <div id="posts" className="blog-content section">
          {props.blogs.map((blog, idx) => {
            return <PostListing key={blog.id} blog={blog} />;
          })}
        </div>

        <style jsx>{`
          * {
          }

          .wrapper {
          }

          .section {
            padding: 0;
            text-align: center;

            width: 100%;
          }

          .padded {
            padding: 140px 0 100px 0;
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
        `}</style>
      </div>
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
