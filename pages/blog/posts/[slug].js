import React from "react";
import Head from "next/head";

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

      <h1>{props.blog.title}</h1>
      {props.blog.subtitle && <h2>{props.blog.subtitle}</h2>}
      <section
        dangerouslySetInnerHTML={{ __html: props.blog.content }}
      ></section>
      <style jsx>{`
        blockquote p {
          background-color: red;
        }
      `}</style>
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
