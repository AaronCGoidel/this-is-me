import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

const AnimateWhenVisible = ({ children, right }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView();

  const transition = {
    duration: 1,
    ease: [0.43, 0.13, 0.23, 0.96],
  };
  const leftVariant = {
    hidden: { x: -100, opacity: 0, transition },
    enter: { x: 0, opacity: 1, transition: { delay: 0.2, ...transition } },
  };
  const rightVariant = {
    hidden: { x: 100, opacity: 0, transition },
    enter: { x: 0, opacity: 1, transition: { delay: 0.2, ...transition } },
  };

  useEffect(() => {
    if (inView) {
      controls.start("enter");
      console.log("foo");
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial="hidden"
      transition={{ duration: 0.3 }}
      variants={right ? rightVariant : leftVariant}
      style={{widht: "fit-content"}}
      className={right && "right"}
    >
      {children}
    </motion.div>
  );
};

export default AnimateWhenVisible;
