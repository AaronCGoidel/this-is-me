import Head from "next/head";
import Nav from "../components/Nav";
import Button from "../components/Button";
import globalStyles from "../styles/global.js";
import Hero from "../components/Hero";
import About from "../components/About";
import Projects from "../components/Projects";
import Contact from "../components/Contact";
import Menu from "../components/Menu";
import smoothscroll from "smoothscroll-polyfill";

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inHero: false,
      menuOpen: false,
      width: 0,
    };

    this.heroRef = React.createRef();
    this.aboutRef = React.createRef();
    this.projRef = React.createRef();
    this.cvRef = React.createRef();
    this.wrapper = React.createRef();

    this.scroll = (ref) => {
      const yOffset = -(window.innerHeight * 0.08);
      const y =
        -this.heroRef.current.getBoundingClientRect().top +
        ref.current.getBoundingClientRect().top +
        yOffset;
      this.wrapper.current.scrollTo({ top: y, behavior: "smooth" });
    };

    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  componentDidMount() {
    window.scrollTo(100, 100);
    smoothscroll.polyfill();

    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions);

    this.io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // console.log(entry.intersectionRatio);
          if (entry.intersectionRatio < 0.85) {
            this.setState({ inHero: false });
            if (entry.intersectionRatio <= 0.08) {
            }
          } else {
            this.setState({ inHero: true });
          }
        });
      },
      { threshold: [0.85, 0.08] }
    );
    this.io.observe(document.querySelector(".hero"));
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth });
  }

  render() {
    return (
      <div className="container">
        <Head>
          <title>Aaron Goidel</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Nav
          width={this.state.width}
          onClickLogo={() => this.scroll(this.heroRef)}
          onClickMenuIcon={() =>
            this.setState({ menuOpen: !this.state.menuOpen })
          }
          onClickLink={this.scroll}
          menuOpen={this.state.menuOpen}
          inHero={this.state.inHero}
          inMenu={this.state.menuOpen}
          refs={[this.aboutRef, this.projRef, this.cvRef]}
        />
        {/* {this.state.menuOpen ? <Menu /> : null} */}
        <div ref={this.wrapper} className="wrapper">
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
          .wrapper {
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
