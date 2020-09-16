import React from "react";
import useWindowDimensions from "../lib/windowSizeHook";

const percent = (scrollPos, docHeight, winHeight) => {
  return (scrollPos / (docHeight - winHeight)) * 100;
};

const ScrollIndicator = (props) => {
  let { height, width } = useWindowDimensions();
  return (
    <div className="indicator">
      <style jsx>{`
        .indicator {
          height: 2px;
          margin-bottom: -2px;
          background: blue;
          width: ${percent(props.scrollPos, props.height, height)}%;
        }
      `}</style>
    </div>
  );
};

export default ScrollIndicator;
