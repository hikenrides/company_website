import { Link } from "react-router-dom";
import { useContext, useState, useEffect, useRef } from "react";
import { UserContext } from "./UserContext";
import { motion } from "framer-motion";
import DropDownProfile from "./DropDownProfile";

export default function Header() {
  const { user } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState("");
  const [openProfile, setOpenProfile] = useState(false);

  let menuRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close the dropdown if the click is outside of the dropdown and user-container2
      if (
        openProfile &&
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        event.target.closest('.user-container2') === null
      ) {
        setOpenProfile(false);
      }
    };

    // Add event listener when the component mounts
    document.addEventListener('click', handleClickOutside);

    // Remove event listener when the component unmounts
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [openProfile, setOpenProfile, menuRef]);

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  

  let easeing = [0.6, -0.05, 0.01, 0.99];

  const header = {
    initial: {
      y: -60,
      opacity: 0,
      transition: { duration: 0.05, ease: easeing },
    },
    animate: {
      y: 0,
      opacity: 1,
      animation: {
        duration: 0.6,
        ease: easeing,
      },
    },
  };
  

  return (
    <div className="flex flex-col items-center">
      <header className="flex justify-between">
        <Link to={"/"} className="flex gap-1">
          <motion.div className="logo_wrapper" variants={header}>
            hike<span>n</span>rides
          </motion.div>
        </Link>

        {/* user-container: Visible on larger screens */}
        <Link
          to={user ? "/account" : "/login"}
          className="user-container hidden md:flex items-center gap-2 border border-gray-300 rounded-full py-1 px-1"
        >
          <div className="bg-gray-500 text-white rounded-full border border-gray-500 overflow-hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6 relative top-1"
            >
              <path
                fillRule="evenodd"
                d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          {!!user && <div className="text-white">{user.name}</div>}
        </Link>

        {/* user-container2: Visible on smartphones */}
        <div  className="user-container2 md:hidden flex items-center gap-2 border border-gray-300 rounded-full py-1 px-1" onClick={() => setOpenProfile((prev) => !prev)} ref={menuRef}>
          <div className="flex bg-gray-500 text-white rounded-full border border-gray-500 overflow-hidden">
          <svg xmlns="http://www.w3.org/2000/svg" height="16" width="14" viewBox="0 0 448 512"><path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z"/></svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6 relative top-1"
            >
              <path
                fillRule="evenodd"
                d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
        {openProfile && <DropDownProfile />}
      </header>

      <div className="tab-container flex gap-1 border border-gray-300 rounded-full py-1 px-2 shadow-md shadow-gray-300">
        <Link to={"/account/trips"}>
          <div
            className={`flex text-white cursor-pointer ${
              activeTab === "tripOffers" ? "shadow-md shadow-gray-300" : ""
            }`}
            onClick={() => handleTabClick("tripOffers")}
          >
            Trips
          </div>
        </Link>
        <div className="border-l border-gray-300" style={{ height: '20px', width: '3px' }}></div>
        <Link to={"/account/requests"}>
          <div
            className={`flex text-white cursor-pointer ${
              activeTab === "requestedTrips" ? "shadow-md shadow-gray-300" : ""
            }`}
            onClick={() => handleTabClick("requestedTrips")}
          >
            Requests
          </div>
        </Link>
      </div>
    </div>
  );
}
