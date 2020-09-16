import { useEffect, useState, useRef } from "react";

export default () => {
  const ref = useRef();
  const [dim, setDim] = useState({});
  useEffect(() => {
    setDim(ref.current.getBoundingClientRect().toJSON());
  }, [ref.current]);

  return [ref, dim];
};
