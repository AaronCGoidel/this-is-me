import globalStyles from "../styles/global.js";
import ProjectItem from "./ProjectItem.js";

const Projects = (props) => (
  <div ref={props.projRef} className="section">
    <div className="heading">
      <h1>My Projects</h1>
    </div>
    <div className="contents">
      <ProjectItem
        link={"/"}
        img={"/thumbnails/personal.jpg"}
        title={"My Portfolio"}
        blurb={
          "The static site generator for the very website you're looking at right now. I use this as a way to share my work so I may hopefully find work."
        }
      />
      <ProjectItem
        link={"http://SafeSend.cf"}
        img={"/thumbnails/safesend.png"}
        title={"SafeSend"}
        blurb={
          "A web app which applies two-factor-authentication and strong cryptography to securely send messages. Go try it out for yourself by clicking on the icon."
        }
      />
      <ProjectItem
        link={
          "https://drive.google.com/drive/folders/1JpVrGEM2hqNzd9Il-Zzz2dt9xaovrhcn?usp=sharing"
        }
        img={"/thumbnails/cookie.png"}
        title={"Cookie"}
        blurb={
          "A better, smarter cookbook, which leverages graph theory algorithms to be more helpful in the kitchen. By dynamically merging recipes and by assessing the current state of the recipe, Cookie makes decisions to get meals cooked faster for the average home cook. You can see pictures of the app in action by clicking on the icon."
        }
      />
      <ProjectItem
        link={
          "https://drive.google.com/drive/folders/1Gdvn_wyBYTbZggAWvivI8bm8LvvkF5xm?usp=sharing"
        }
        img={"/thumbnails/registrar.png"}
        title={"Registrar"}
        blurb={
          "A smart system for organizing my vinyl records. Registrar is a web app which scrapes the internet for information on any album, such as track lists and album covers. It implements custom search and sorting features so that I can browse my records on my phone. Click the icon for screenshots."
        }
      />
    </div>
    <style jsx>{``}</style>
    <style jsx global>
      {globalStyles}
    </style>
  </div>
);

export default Projects;
