import React from "react";
import Link from "next/link";
import Menu from "../components/Menu";
import Hamburger from "../components/Hamburger";

const Nav = (props) => {
  return (
    <div>
      <Menu
        open={props.menuOpen}
        onClick={props.onClickLink}
        refs={props.refs}
      />
      <nav className={`${!props.inHero || props.menuOpen ? "dark" : ""}`}>
        <style jsx>
          {`
            nav {
              position: fixed;
              top: 0;
              right: 0;
              left: 0;
              height: 8vh;
              z-index: 1;
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: space-between;
              padding: 0 15px;
              color: #fff;
              transition: all 150ms ease-in;
            }

            .dark {
              border-bottom: 1px solid #e0e0e0;
              background-color: #fff;
              color: #000;
            }

            .buttons {
              display: flex;
              flex-direction: row;
            }

            .buttons div {
              cursor: pointer;
            }

            .nav-button {
              margin: 0 12px;
            }

            .nav-button:hover {
              color: #808080;
            }
          `}
        </style>
        <div style={{ cursor: "pointer" }} onClick={props.onClickLogo}>
          <h2>Aaron Goidel</h2>
        </div>

        {props.width > 550 ? (
          <div className="buttons">
            {props.refs.map((link, idx) => {
              return (
                <div
                  onClick={() => props.onClickLink(link.link)}
                  className="nav-button"
                >
                  <h4>{link.name}</h4>
                </div>
              );
            })}
          </div>
        ) : (
          <Hamburger
            active={props.menuOpen}
            onClick={props.onClickMenuIcon}
            light={props.inHero && !props.menuOpen}
          />
        )}
      </nav>
    </div>
  );
};

export default Nav;
