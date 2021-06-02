import "./index.css";
import "../components/ProjectCard.css";
import "../pages/projects/projects.css";
import { AnimateSharedLayout } from "framer-motion";
import { useEffect } from "react";
import { useRouter } from "next/router";

import { pageview, event } from "../lib/ga";

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url) => {
      pageview(url);
    };

    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <AnimateSharedLayout>
      <Component {...pageProps} />
    </AnimateSharedLayout>
  );
}

export default MyApp;
