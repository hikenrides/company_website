import { useContext,useState, useEffect, useRef} from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./UserAuthContext";

const DropDownProfile = () => {
  const { user } = useContext(UserContext);
  const [open, setOpen] = useState(false);

  let menuRef = useRef();

  useEffect(() => {
    let handler = (e) => {
      if (!menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
  
    document.addEventListener("mousedown", handler);
  
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, [open, menuRef]);
  

  return (
    <div className={`flex flex-col dropDownProfile ${open? 'active' : 'inactive'}`}>
      <ul className="flex flex-col gap-4">
        <Link
          to={user ? "/account" : "/login"}
          className="user-container flex items-center gap-2 border border-gray-300 rounded-full py-1 px-1"
        >
          Profile
        </Link>
        <Link className="user-container flex items-center gap-2 border border-gray-300 rounded-full py-1 px-1" to={"/account/bookings"}>
          My Bookings
        </Link>
        <Link className="user-container flex items-center gap-2 border border-gray-300 rounded-full py-1 px-1" to={"/account/places"}>
          My trip offers
        </Link>
        <Link className="user-container flex items-center gap-2 border border-gray-300 rounded-full py-1 px-1" to={"/account/Myrequests"}>
          My trip Requests
        </Link>
      </ul>
    </div>
  );
};

export default DropDownProfile;

