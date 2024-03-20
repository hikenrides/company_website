import { Link } from "react-router-dom";
import { useContext, useState, useEffect, useRef } from "react";
import { UserContext } from "./UserContext";
import { motion } from "framer-motion";
import DropDownProfile from "./DropDownProfile";

export default function Header() {
  const { user } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState(null); // Initialize active tab to null
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
    setActiveTab(tabName === activeTab ? null : tabName); // Toggle active tab
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
              activeTab === "tripOffers" ? "bg-green-500 rounded-full px-2 py-1" : "" // Add rounded shape and padding to active tab
            }`}
            onClick={() => handleTabClick("tripOffers")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-car-front-fill" viewBox="0 0 16 16">
  <path d="M2.52 3.515A2.5 2.5 0 0 1 4.82 2h6.362c1 0 1.904.596 2.298 1.515l.792 1.848c.075.175.21.319.38.404.5.25.855.715.965 1.262l.335 1.679q.05.242.049.49v.413c0 .814-.39 1.543-1 1.997V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.338c-1.292.048-2.745.088-4 .088s-2.708-.04-4-.088V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.892c-.61-.454-1-1.183-1-1.997v-.413a2.5 2.5 0 0 1 .049-.49l.335-1.68c.11-.546.465-1.012.964-1.261a.8.8 0 0 0 .381-.404l.792-1.848ZM3 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2m10 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2M6 8a1 1 0 0 0 0 2h4a1 1 0 1 0 0-2zM2.906 5.189a.51.51 0 0 0 .497.731c.91-.073 3.35-.17 4.597-.17s3.688.097 4.597.17a.51.51 0 0 0 .497-.731l-.956-1.913A.5.5 0 0 0 11.691 3H4.309a.5.5 0 0 0-.447.276L2.906 5.19Z"/>
</svg>
            Trips
          </div>
        </Link>
        <div className="border-l border-gray-300" style={{ height: '20px', width: '3px' }}></div>
        <Link to={"/account/requests"}>
        <div
            className={`flex text-white cursor-pointer ${
              activeTab === "requestedTrips" ? "bg-green-500 rounded-full px-2 py-1" : "" // Add rounded shape and padding to active tab
            }`}
            onClick={() => handleTabClick("requestedTrips")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-standing" viewBox="0 0 16 16">
  <path d="M8 3a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3M6 6.75v8.5a.75.75 0 0 0 1.5 0V10.5a.5.5 0 0 1 1 0v4.75a.75.75 0 0 0 1.5 0v-8.5a.25.25 0 1 1 .5 0v2.5a.75.75 0 0 0 1.5 0V6.5a3 3 0 0 0-3-3H7a3 3 0 0 0-3 3v2.75a.75.75 0 0 0 1.5 0v-2.5a.25.25 0 0 1 .5 0"/>
</svg>
            Requests
          </div>
        </Link>
      </div>
    </div>
  );
}
