import "./index.css";
import "../components/ProjectCard.css";
import "../pages/project/projects.css"
import { AnimateSharedLayout } from "framer-motion";

function MyApp({ Component, pageProps }) {
  return (
    <AnimateSharedLayout>
      <Component {...pageProps} />
    </AnimateSharedLayout>
   );
}

export default MyApp;
