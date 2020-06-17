import globalStyles from "../styles/global.js";

const Contact = (props) => (
  <div ref={props.cvRef} className="section">
    <div className="heading">
      <h1>CV - Contact</h1>
      <div className="highlight" />
    </div>
    <div className="">
      <div>Want a copy?</div>
      <a href="/Goidel_CV.pdf" rel="download">
        Download my resume [PDF]
      </a>
    </div>
    <object data="/Goidel_CV.pdf">
      <p>Sorry, this browser does not support PDF previews.</p>
    </object>
    You can reach me at the following email: acgoidel@gmail.com
    <style jsx>
      {`
        object {
          height: 70vh;
          width: 50vw;
          margin: 10px 0;
        }

        @media (max-width: 1000px) {
          object {
            width: 90vw;
          }
        }
      `}
    </style>
    <style jsx global>
      {globalStyles}
    </style>
  </div>
);

export default Contact;
