import globalStyles from "../styles/global.js";

const Contact = (props) => (
  <div ref={props.cvRef} className="section">
    <h1>Contact</h1>

    <style jsx global>
      {globalStyles}
    </style>
  </div>
);

export default Contact;
