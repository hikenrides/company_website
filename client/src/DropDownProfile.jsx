import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { UserContext } from "./UserAuthContext";

const DropDownProfile = () => {
  const { user } = useContext(UserContext);
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  let subpage = pathname.split("/")?.[2];
  if (subpage === undefined) {
    subpage = "profile";
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    // Add event listener when the component mounts
    document.addEventListener("click", handleClickOutside);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []); // Empty dependency array means this effect runs once on mount

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <div
        className="cursor-pointer user-container flex items-center gap-2 border border-gray-300 rounded-full py-1 px-1"
        onClick={handleToggleDropdown}
      >
        {user ? "Profile" : "Login"}
      </div>
      {isOpen && (
        <div className="dropDownProfile">
          <ul className="flex flex-col gap-4">
            <Link
              to={user ? "/account" : "/login"}
              className="user-container flex items-center gap-2 border border-gray-300 rounded-full py-1 px-1"
            >
              Profile
            </Link>
            <Link
              className="user-container flex items-center gap-2 border border-gray-300 rounded-full py-1 px-1"
              to={"/account/bookings"}
            >
              My Bookings
            </Link>
            <Link
              className="user-container flex items-center gap-2 border border-gray-300 rounded-full py-1 px-1"
              to={"/account/places"}
            >
              My trip offers
            </Link>
            <Link
              className="user-container flex items-center gap-2 border border-gray-300 rounded-full py-1 px-1"
              to={"/account/Myrequests"}
            >
              My trip Requests
            </Link>
          </ul>
        </div>
      )}
    </div>
  );
};

export default DropDownProfile;
