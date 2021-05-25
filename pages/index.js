import Link from "next/link";
import Home from "../components/Home";
import ProjectCard from "../components/ProjectCard";

export default function Index() {
  return (
    <>
      <Home />
      <main>
        <header>
          <h1>Hi, I'm Aaron!</h1>
        </header>

        <section>
          <h1>About Me</h1>
          <p>
            I am an Intensely passionate student, currently studying Computer
            Science and Linguistics at the University of Toronto. I work
            part-time as a backend engineer and am always tinkering and reading.
            I am passionate about software as the tool to build a better future.
          </p>

          <p>
            My main interests in school are in computational linguistics as well
            as languages and compilers. I am a Technical Officer in the Computer
            Science Student Community, helping students to bridge the gap
            between theory and implementation by mentoring them during the
            development process.
          </p>

          <p>
            Out of school, I have experience developing production software in
            teams small to large. I enjoy making small web projects as well as
            exploring many other areas of computer science. These range from
            language design, to physics simulations, to blockchain, and beyond.
            I have a love of all things food and cooking and I am always
            listening to or making music.
          </p>
        </section>

        <section className="right">
        <h1>My Projectsw</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
          <div className="cards">
            
              <ProjectCard img={"lady.jpg"} />
              <ProjectCard img={"lady.jpg"} />
              <ProjectCard img={"lady.jpg"} />
              <ProjectCard img={"lady.jpg"} />
              <ProjectCard img={"lady.jpg"} />
            
          </div>
        </section>

        <section>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>

          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </section>
      </main>
    </>
  );
}
