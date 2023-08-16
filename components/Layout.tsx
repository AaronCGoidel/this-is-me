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
        <div className="max-w-5xl px-8 mx-auto">
          <a
            className="text-content hover:text-hover"
            href="https://aarongoidel.com"
          >
            Aaron Goidel
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
