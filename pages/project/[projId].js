import { useRouter } from "next/router";
import { motion } from "framer-motion";
import {IoMdArrowRoundBack} from "react-icons/io"

const ProjectPage = () => {
  const router = useRouter();

  const { projId } = router.query;

  return (
    <motion.div
      style={{ color: "#fff" }}
      layoutId={"proj-container"}
      className="project-container"
    >
      <IoMdArrowRoundBack size={50} style={{position:"fixed", top: "1rem", left: "1rem", zIndex: 2}} onClick={()=>{router.back()}}/>
      <div className="meta-info">
        <motion.img layoutId="img" src={"/lady.jpg"} className="cover-img" />
        <motion.h1 layoutId="title">Lectern</motion.h1>
        <motion.p>Foo bar</motion.p>
      </div>
      <div className="content">
        <h1>Foo bar</h1>
        <p>
          Enim ut consectetur aliqua et veniam nulla ullamco consequat dolore
          tempor. Sunt commodo consequat officia nulla labore. Dolore eiusmod
          amet dolor culpa magna mollit elit est eiusmod commodo officia
          nostrud. Labore ad anim et in eu sit nisi deserunt id ullamco
          incididunt excepteur. Mollit officia irure minim magna aliqua eiusmod
          magna sit eu Lorem consectetur. Ad ut eiusmod amet dolor. Aliqua
          officia deserunt quis adipisicing sint Lorem cillum occaecat laboris
          exercitation duis.
        </p>
        <p>
          Enim fugiat eiusmod ut id reprehenderit minim. Excepteur anim proident
          id eiusmod Lorem cillum consequat labore officia id occaecat. Tempor
          eiusmod ut irure nostrud amet exercitation ea nulla cupidatat anim
          culpa. Duis dolore ad nulla consectetur do minim amet incididunt. Duis
          tempor anim aliqua in culpa. Aliquip ex non incididunt enim tempor
          ullamco non. Cupidatat non nisi excepteur sint sint esse duis minim
          aliqua laboris magna. Aliquip ullamco ea culpa amet et elit. Aliquip
          dolore id minim proident Lorem anim nostrud consectetur culpa fugiat
          cupidatat eu ad dolore. Magna laboris velit esse commodo elit duis
          ipsum occaecat dolore et ipsum laboris minim cillum. Lorem anim
          nostrud labore duis veniam consectetur cupidatat exercitation ad
          deserunt excepteur aute fugiat consequat.
        </p>
        <p>
          Enim fugiat eiusmod ut id reprehenderit minim. Excepteur anim proident
          id eiusmod Lorem cillum consequat labore officia id occaecat. Tempor
          eiusmod ut irure nostrud amet exercitation ea nulla cupidatat anim
          culpa. Duis dolore ad nulla consectetur do minim amet incididunt. Duis
          tempor anim aliqua in culpa. Aliquip ex non incididunt enim tempor
          ullamco non. Cupidatat non nisi excepteur sint sint esse duis minim
          aliqua laboris magna. Aliquip ullamco ea culpa amet et elit. Aliquip
          dolore id minim proident Lorem anim nostrud consectetur culpa fugiat
          cupidatat eu ad dolore. Magna laboris velit esse commodo elit duis
          ipsum occaecat dolore et ipsum laboris minim cillum. Lorem anim
          nostrud labore duis veniam consectetur cupidatat exercitation ad
          deserunt excepteur aute fugiat consequat.
        </p>
        <p>
          Enim fugiat eiusmod ut id reprehenderit minim. Excepteur anim proident
          id eiusmod Lorem cillum consequat labore officia id occaecat. Tempor
          eiusmod ut irure nostrud amet exercitation ea nulla cupidatat anim
          culpa. Duis dolore ad nulla consectetur do minim amet incididunt. Duis
          tempor anim aliqua in culpa. Aliquip ex non incididunt enim tempor
          ullamco non. Cupidatat non nisi excepteur sint sint esse duis minim
          aliqua laboris magna. Aliquip ullamco ea culpa amet et elit. Aliquip
          dolore id minim proident Lorem anim nostrud consectetur culpa fugiat
          cupidatat eu ad dolore. Magna laboris velit esse commodo elit duis
          ipsum occaecat dolore et ipsum laboris minim cillum. Lorem anim
          nostrud labore duis veniam consectetur cupidatat exercitation ad
          deserunt excepteur aute fugiat consequat.
        </p>
        <p>
          Enim fugiat eiusmod ut id reprehenderit minim. Excepteur anim proident
          id eiusmod Lorem cillum consequat labore officia id occaecat. Tempor
          eiusmod ut irure nostrud amet exercitation ea nulla cupidatat anim
          culpa. Duis dolore ad nulla consectetur do minim amet incididunt. Duis
          tempor anim aliqua in culpa. Aliquip ex non incididunt enim tempor
          ullamco non. Cupidatat non nisi excepteur sint sint esse duis minim
          aliqua laboris magna. Aliquip ullamco ea culpa amet et elit. Aliquip
          dolore id minim proident Lorem anim nostrud consectetur culpa fugiat
          cupidatat eu ad dolore. Magna laboris velit esse commodo elit duis
          ipsum occaecat dolore et ipsum laboris minim cillum. Lorem anim
          nostrud labore duis veniam consectetur cupidatat exercitation ad
          deserunt excepteur aute fugiat consequat.
        </p>
        <p>
          Enim fugiat eiusmod ut id reprehenderit minim. Excepteur anim proident
          id eiusmod Lorem cillum consequat labore officia id occaecat. Tempor
          eiusmod ut irure nostrud amet exercitation ea nulla cupidatat anim
          culpa. Duis dolore ad nulla consectetur do minim amet incididunt. Duis
          tempor anim aliqua in culpa. Aliquip ex non incididunt enim tempor
          ullamco non. Cupidatat non nisi excepteur sint sint esse duis minim
          aliqua laboris magna. Aliquip ullamco ea culpa amet et elit. Aliquip
          dolore id minim proident Lorem anim nostrud consectetur culpa fugiat
          cupidatat eu ad dolore. Magna laboris velit esse commodo elit duis
          ipsum occaecat dolore et ipsum laboris minim cillum. Lorem anim
          nostrud labore duis veniam consectetur cupidatat exercitation ad
          deserunt excepteur aute fugiat consequat.
        </p>
        <p>
          Enim fugiat eiusmod ut id reprehenderit minim. Excepteur anim proident
          id eiusmod Lorem cillum consequat labore officia id occaecat. Tempor
          eiusmod ut irure nostrud amet exercitation ea nulla cupidatat anim
          culpa. Duis dolore ad nulla consectetur do minim amet incididunt. Duis
          tempor anim aliqua in culpa. Aliquip ex non incididunt enim tempor
          ullamco non. Cupidatat non nisi excepteur sint sint esse duis minim
          aliqua laboris magna. Aliquip ullamco ea culpa amet et elit. Aliquip
          dolore id minim proident Lorem anim nostrud consectetur culpa fugiat
          cupidatat eu ad dolore. Magna laboris velit esse commodo elit duis
          ipsum occaecat dolore et ipsum laboris minim cillum. Lorem anim
          nostrud labore duis veniam consectetur cupidatat exercitation ad
          deserunt excepteur aute fugiat consequat.
        </p>
      </div>
    </motion.div>
  );
};

export default ProjectPage;
