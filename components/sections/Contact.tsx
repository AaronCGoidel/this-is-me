import React from "react";

const Contact = (): JSX.Element => {
  return (
    <div
      id="contact"
      className="pt-16 flex flex-col items-center justify-center"
    >
      <h2 className="text-4xl mb-4 font-bold text-heading text-center">
        Grab a copy of my resume or email me
      </h2>

      <a
        href={`mailto:acgoidel@gmail.com`}
        className="decoration-primary underline font-bold text-center text-3xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary m-2 decoration-dashed hover:decoration-solid transition duration-200 ease-in-out"
      >
        acgoidel@gmail.com
      </a>

      <button className="bg-gradient-to-r from-primary to-secondary text-white rounded-md p-1 m-2">
        <a
          className="flex w-full bg-white text-heading font-semibold rounded p-3 hover:bg-inherit hover:text-white transition duration-200 ease-in-out"
          href="/resume.pdf"
          download
        >
          Download Resume
        </a>
      </button>
    </div>
  );
};

export default Contact;
