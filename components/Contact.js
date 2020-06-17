import globalStyles from "../styles/global.js";
import Form from "./Form";

const Contact = (props) => (
  <div ref={props.cvRef} className="section">
    <div className="heading">
      <h1>Résumé</h1>
    </div>
    <div className="contents box">
      <div className="">
        <div>Want a copy?</div>
        <a href="/Goidel_CV.pdf" download>
          Download my resume [PDF]
        </a>

        <object data="/Goidel_CV.pdf">
          <p>Sorry, this browser does not support PDF previews.</p>
        </object>
      </div>
      {/* <div className="col">
        You can reach me at the following email: acgoidel@gmail.com
        <Form />
      </div> */}
    </div>
    <style jsx>
      {`
        .box {
          width: 90vw;
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
        }
        @media (max-width: 1000px) {
          .box {
            width: 90vw;
          }
        }
        .col {
          flex: 0.5;
          height: 60vh;
          margin: 0 4vw 0 0;
        }
        .row {
          flex-direction: row;
          padding: 0;
        }

        object {
          height: 70vh;
          width: 90vw;
          display: block;
          margin: 0;
        }
      `}
    </style>
    <style jsx global>
      {globalStyles}
    </style>
  </div>
);

export default Contact;
