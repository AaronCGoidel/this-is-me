import React, { useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import globalStyles from "../../../styles/global";
import useScrollPosition from "../../../lib/scrollHook";
import ScrollIndicator from "../../../components/ScrollInicator";
import useDimensions from "../../../lib/dimHook";
import BackArrow from "../../../components/BackArrow";

function Post(props) {
  const {
    query: { dark },
  } = useRouter();
  const scrollPos = useScrollPosition();
  const [contentRef, { height }] = useDimensions();
  const [headerRef, headerDim] = useDimensions();
  return (
    <div className="blog-post">
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

      <header ref={headerRef}>
        <div className="header-content">
          <h2 className="header-title">
            {props.blog.title} <span>by Aaron Goidel</span>
          </h2>
        </div>
        <ScrollIndicator scrollPos={scrollPos} height={height} />
      </header>

      <div className="content" ref={contentRef}>
        <div className="title-wrapper">
          <h1 className="title">{props.blog.title}</h1>
        </div>
        {props.blog.subtitle && <h2>{props.blog.subtitle}</h2>}
        <section
          dangerouslySetInnerHTML={{ __html: props.blog.content }}
        ></section>
      </div>

      <footer></footer>
      <style jsx>{`
        * {
          // margin: 0;
        }

        :global(code) {
          background-color: #f6f8fa;
          border-radius: 5px;
          padding: 0 0.5rem;
        }

        :global(section) {
          margin-top: 2rem;
        }

        :global(.hljs) {
          padding: 0.75rem;
        }

        :global(blockquote) {
          margin: 0;
          border-left: 3px solid #7a7a7a;
          font-style: italic;
          padding: 0.5rem 1.33em;
          text-align: left;
          background-color: #00000011;
          // border-radius: 5px;
          margin: 0 2rem;
        }

        :global(h1, h2, h3, h4, h5) {
          display: inline-block;

          background-image: linear-gradient(120deg, #00c9ff 0%, #92fe9d 100%);
          background-repeat: no-repeat;
          background-size: 100% 0.4em;
          background-position: 0 88%;
        }

        .title {
          display: inline;
        }

        :global(a) {
          color: #00c9ff;
          text-decoration: none;
          transition: all 250ms ease-in-out;
        }

        :global(a:hover) {
          text-decoration: underline;
        }

        .blog-post {
          min-height: 100vh;
          background-color: #fff;
        }

        body {
          font-weight: 400;
          font-size: 16px;
          line-height: 1.8;

          background-color: #fff;
        }

        .content {
          position: relative;
          width: clamp(60%, 80%, 610px);
          margin: 0 auto;
          padding: calc(${headerDim.height}px + 2rem) 0;
        }

        .header-title {
          background: white;
          // background: linear-gradient(120deg, #84fab0 0%, #8fd3f4 80%);
          // -webkit-background-clip: text;
          // -webkit-text-fill-color: transparent;
        }

        h1 {
          font-size: 2.6em;
          line-height: 1.3;
        }

        h2 span {
          color: #777777;
          font-size: 1.1rem;
          // -webkit-text-fill-color: #777777;
          // background-color: white;
          // padding-left: 0.2rem;
        }

        header {
          position: fixed;
          top: 0;
          left: 0;
          z-index: 1;
          width: 100%;
          background: #fff;
          border-bottom: 1px solid #ccc;
          // height: 5rem;
        }

        .header-content {
          width: clamp(60%, 80%, 610px);
          margin: 0 auto;
        }

        p {
          color: blue;
          margin-bottom: 5em;
        }

        :global(html) {
          ${dark == "true" ? "filter: invert(1) hue-rotate(-50deg);" : ""}
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
