import React from 'react';
import Navigation from './Navigation';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps): JSX.Element => {
  return (
    <div className="overflow-scroll h-screen w-screen">
      <header>
        <div className="max-w-5xl px-8 mx-auto">
          <div className="flex items-center justify-between py-6">
            <Navigation />
          </div>
        </div>
      </header>
      <main>
        <div className="max-w-5xl px-8 py-4 mx-auto">{children}</div>
      </main>
      
      {/* footer with horizontal line */}
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
