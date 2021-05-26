import { GoPrimitiveDot } from "react-icons/go";
const Tag = ({ color, text }) => {
  return <div className={"tag"}>
      <GoPrimitiveDot color={color}/>
      <p>python</p>
  </div>;
};
export default Tag;