import { useEffect, useState, useRef } from "react";

export default () => {
  const hasWindow = typeof window !== "undefined";
  const ref = useRef();

  const getDimensions = () => {
    return ref.current ? ref.current.getBoundingClientRect().toJSON() : 0;
  };

  const [dimensions, setDimensions] = useState(getDimensions());

  useEffect(() => {
    if (hasWindow) {
      if (!dimensions) {
        setDimensions(getDimensions());
      }
      const handleResize = () => {
        setDimensions(getDimensions());
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [ref.current, hasWindow]);

  return [ref, dimensions];
};
