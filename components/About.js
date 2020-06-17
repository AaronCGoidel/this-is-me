import globalStyles from "../styles/global.js";

const About = (props) => (
  <div ref={props.aboutRef} className="section">
    <div className="heading">
      <h1>About Me</h1>
    </div>
    <div className="contents bio">
      <p>
        I am currently studying Computer Science at the University of Toronto
        and am working designing and developing cross-platform websites.
      </p>
      <br />
      <p>
        I work to make clean, simple, websites which focus on content and ease
        of use. All of my products are dynamic, meaning they will impress on all
        platforms, mobile and desktop.
      </p>
      <br />
      <p>
        My interests are in web development as well as computational linguistics
        and artificial intelligence. I have a love of all things food and
        cooking and I am always listening to or making music.
      </p>
    </div>
    <style jsx>{`
      p {
        margin: 10px;
      }
      .bio {
        width: 80vw;
      }

      @media (max-width: );
    `}</style>
    <style jsx global>
      {globalStyles}
    </style>
  </div>
);

export default About;
