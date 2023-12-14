import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { UserContext } from "./UserAuthContext";

const DropDownProfile = () => {
  const { user } = useContext(UserContext);
  const { pathname } = useLocation();

  let subpage = pathname.split("/")?.[2];
  if (subpage === undefined) {
    subpage = "profile";
  }

  function linkClasses(type = null) {
    let classes = "inline-flex gap-1 py-2 px-6 rounded-full";
    if (type === subpage) {
      classes += " bg-primary text-white";
    } else {
      classes += " bg-gray-200";
    }
    return classes;
  }

  return (
    <div className="flex flex-col dropDownProfile">
      <ul className="flex flex-col gap-4">
        <Link
          to={user ? "/account" : "/login"}
          className="user-container flex items-center gap-2 border border-gray-300 rounded-full py-1 px-1"
        >
          Profile
        </Link>
        <Link className={linkClasses("bookings")} to={"/account/bookings"}>
          My Bookings
        </Link>
        <Link className={linkClasses("places")} to={"/account/places"}>
          My trip offers
        </Link>
        <Link className={linkClasses("requests")} to={"/account/Myrequests"}>
          My trip Requests
        </Link>
      </ul>
    </div>
  );
};

export default DropDownProfile;

