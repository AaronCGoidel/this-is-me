import React from "react";
import Head from "next/head";
import globalStyles from "../../../styles/global";

function Post(props) {
  return (
    <div>
      <Head>
        <title>{`${props.blog.title} | Aaron Goidel`}</title>
        <link rel="icon" href="/favicon.ico" />

        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.2.0/styles/vs2015.min.css"
          integrity="sha512-w8aclkBlN3Ha08SMwFKXFJqhSUx2qlvTBFLLelF8sm4xQnlg64qmGB/A6pBIKy0W8Bo51yDMDtQiPLNRq1WMcQ=="
          crossOrigin="anonymous"
        />
        <script src="//cdnjs.cloudflare.com/ajax/libs/highlight.js/8.4/highlight.min.js"></script>
        <script>hljs.initHighlightingOnLoad();</script>
      </Head>
      <div className="content">
        <h1>{props.blog.title}</h1>
        {props.blog.subtitle && <h2>{props.blog.subtitle}</h2>}
        <section
          dangerouslySetInnerHTML={{ __html: props.blog.content }}
        ></section>
      </div>
      <style jsx>{`
        * {
          margin: 0;
        }

        body {
          font-weight: 400;
          font-size: 16px;
          line-height: 1.8;
        }

        .content {
          position: relative;
          max-width: 610px;
          margin: 0 auto;
          padding: 60px 30px 90px;
        }

        h1 {
          font-size: 2.6em;
          line-height: 1.3;
        }

        #__next > div > div > section > p:nth-child(1) {
          color: red;
        }

        p {
          color: blue;
          margin-bottom: 5em;
        }

        blockquote p {
          background-color: red;
        }
      `}</style>
      <style jsx global>
        {globalStyles}
      </style>
    </div>
  );
}

export async function getStaticProps(context) {
  const fs = require("fs");
  const html = require("remark-html");
  const highlight = require("remark-highlight.js");
  const unified = require("unified");
  const markdown = require("remark-parse");
  const matter = require("gray-matter");

  const slug = context.params.slug;
  const path = `${process.cwd()}/pages/blog/posts/${slug}.md`;

  const rawContent = fs.readFileSync(path, {
    encoding: "utf-8",
  });

  const { data, content } = matter(rawContent);

  const result = await unified()
    .use(markdown)
    .use(highlight)
    .use(html)
    .process(content);

  return {
    props: {
      blog: {
        ...data,
        content: result.toString(),
      },
    },
  };
}

// generate HTML paths at build time
export async function getStaticPaths(context) {
  const fs = require("fs");

  const path = `${process.cwd()}/pages/blog/posts`;
  const files = fs.readdirSync(path, "utf-8");

  const markdownFileNames = files
    .filter((fn) => fn.endsWith(".md"))
    .map((fn) => fn.replace(".md", ""));

  return {
    paths: markdownFileNames.map((fileName) => {
      return {
        params: {
          slug: fileName,
        },
      };
    }),
    fallback: false,
  };
}

export default Post;
