import { NavLink } from "react-router-dom";
import Brand from "./brand";
import Username from "./username";

const Navigation = () => {
  return (
    <div className="flex justify-between items-center">
      <NavLink to="/">
        <Brand />
      </NavLink>

      <div className="flex items-center space-x-16">
        <NavLink to="/about">About</NavLink>

        <Username />
      </div>
    </div>
  );
};

export default Navigation;
