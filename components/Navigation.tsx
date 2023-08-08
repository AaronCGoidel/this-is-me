import Link from 'next/link';
import React from 'react';

const Navigation = (): JSX.Element => {
  return (
    <nav>
      <Link className="pr-6 py-4 text-content hover:text-hover" href="/">
        Home
      </Link>
      <Link className="px-6 py-4 text-content hover:text-hover" href="/about">
        About
      </Link>
    </nav>
  );
};

export default Navigation;
