import React from "react";
import Navigation from "./Navigation";

type LayoutProps = {
  children: React.ReactNode;
  id?: string;
};

const Layout = ({ children, id }: LayoutProps): JSX.Element => {
  return (
    <div id={`${id}`} className="h-screen w-screen">
      <header className="md:relative fixed z-10">
        <div className="max-w-5xl px-8 mx-auto">
          <div className="flex items-center justify-between py-6">
            <Navigation />
          </div>
        </div>
      </header>
      <main className="pt-16 md:pt-0">
        <div className="max-w-5xl px-8 py-4 mx-auto">{children}</div>
      </main>

      <footer className="py-8">
        <div className="max-w-5xl px-8 mx-auto flex">
          <a
            className="text-content hover:text-hover mr-4"
            href="https://aarongoidel.com"
          >
            Aaron Goidel
          </a>
          <a
            className="text-content hover:text-hover mr-4"
            href="https://github.com/aaroncgoidel/"
          >
            Github
          </a>
          <a
            className="text-content hover:text-hover"
            href="https://www.linkedin.com/in/aaroncgoidel/"
          >
            LinkedIn
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
