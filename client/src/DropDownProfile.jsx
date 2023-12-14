import { useContext,useState, useEffect, useRef} from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./UserAuthContext";

const DropDownProfile = () => {
  const { user } = useContext(UserContext);
  const [open, setOpen] = useState(false);
  

  return (
    <div className={`flex flex-col dropDownProfile ${open? 'active' : 'inactive'}`}>
      <ul className="flex flex-col gap-4">
        <Link
          to={user ? "/account" : "/login"}
          className="user-container flex items-center gap-2 "
        >
          Profile
        </Link>
        <Link className="user-container flex items-center gap-2 " to={"/account/bookings"}>
          My Bookings
        </Link>
        <Link className="user-container flex items-center gap-2 " to={"/account/places"}>
          My trip offers
        </Link>
        <Link className="user-container flex items-center gap-2" to={"/account/Myrequests"}>
          My trip Requests
        </Link>
      </ul>
    </div>
  );
};

export default DropDownProfile;

