import Head from "next/head";
import Nav from "../components/Nav";
import Button from "../components/Button";
import globalStyles from "../styles/global.js";
import Hero from "../components/Hero";
import About from "../components/About";
import Projects from "../components/Projects";
import Contact from "../components/Contact";

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollStatus: "hero",
      menuOpen: false,
    };

    this.heroRef = React.createRef();
    this.aboutRef = React.createRef();
    this.projRef = React.createRef();
    this.cvRef = React.createRef();
    this.scroll = (ref) => {
      ref.current.scrollIntoView({ behavior: "smooth" });
    };
  }

  componentDidMount() {
    this.io = new IntersectionObserver(
      (entries) => {
        console.log(entries);
      },
      { threshold: 1.0 }
    );
    const elements = Array.from(document.querySelectorAll(".section"));
    // elements.forEach((element) => this.io.observe(element));
    this.io.observe(elements[1]);
  }

  render() {
    return (
      <div className="container">
        <Head>
          <title>Aaron Goidel</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Nav
          onClickLogo={() => this.scroll(this.heroRef)}
          onClickMenuIcon={() =>
            this.setState({ menuOpen: !this.state.menuOpen })
          }
          menuOpen={this.state.menuOpen}
          loc={this.state.scrollStatus}
        />

        <div className="parallax-wrapper">
          <Hero
            heroRef={this.heroRef}
            onClick={this.scroll}
            refs={[this.aboutRef, this.projRef, this.cvRef]}
          />

          <About aboutRef={this.aboutRef} />

          <Projects projRef={this.projRef} />

          <Contact cvRef={this.cvRef} />
        </div>

        {/* STYLE */}
        <style jsx>{`
          .parallax-wrapper {
            height: 100vh;
            overflow-x: hidden;
            overflow-y: auto;
            perspective: 2px;
          }
        `}</style>

        <style jsx global>
          {globalStyles}
        </style>
      </div>
    );
  }
}
