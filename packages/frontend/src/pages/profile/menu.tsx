import { Link } from "react-router-dom";
import calculatorPng from "../../assets/calculator-iso-color.png";
import calenderPng from "../../assets/calender-iso-color.png";
import targetPng from "../../assets/target-iso-color.png";
import bagPng from "../../assets/bag-iso-color.png";

const ProfileMenu = () => {
  return (
    <ul className="menu backdrop-blur-xl shadow-xl rounded-box">
      <li>
        <Link to="settleAccounts">
          <img src={calculatorPng} alt="calculator png" className="w-16 h-16" />
        </Link>
      </li>
      <li>
        <Link to="periodRecord">
          <img src={calenderPng} alt="calender png" className="w-16 h-16" />
        </Link>
      </li>
      <li>
        <Link to="bucketList">
          <img src={targetPng} alt="target png" className="w-16 h-16" />
        </Link>
      </li>
      <li>
        <Link to="shoppingCart">
          <img src={bagPng} alt="bag png" className="w-16 h-16" />
        </Link>
      </li>
    </ul>
  );
};

export default ProfileMenu;
