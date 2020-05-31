import React from "react";

const Nav = () => (
  <nav>
    <style jsx>
      {`
        nav {
          z-index: 1;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          padding: 0 15px;
          box-shadow: 0px 0px 4px 1px rgba(0, 0, 0, 0.45);
        }
      `}
    </style>
    <h3>Aaron Goidel</h3>
  </nav>
);

export default Nav;
