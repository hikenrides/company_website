import {
  ChevronLast,
  ChevronFirst,
  Home,
  User,
  Settings,
  Info,
  Car,
  PersonStandingIcon,
} from "lucide-react";
import { useContext, createContext, useState } from "react";
import { UserContext } from "./UserContext";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const SidebarContext = createContext();

export default function Sidebar({ children }) {
  const [expanded, setExpanded] = useState(false);
  const [profileExpanded, setProfileExpanded] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleAuthClick = () => {
    if (user) {
      localStorage.removeItem("token");
      setUser(null);
      navigate("/login");
    } else {
      navigate("/login");
    }
  };

  const handleSelect = () => {
    setExpanded(false);
    setProfileExpanded(false);
  };

  return (
    <aside
      className={`fixed top-0 right-0 h-screen z-50 transition-all duration-300 ease-in-out ${
        expanded ? "w-60" : "w-0"
      }`}
    >
      <nav className="h-full flex flex-col bg-white border-l shadow-sm">
        <div className="p-4 pb-2 flex justify-end items-center mr-20">
        {/*<h2 className="font-semibold text-white">
            {user ? `${user.name}` : "LOGIN"}
          </h2>*/}
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-2 rounded-lg bg-gray-300 hover:bg-gray-100"
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>

        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3 space-y-2">
            <Link to="/" onClick={handleSelect} className="flex items-center">
              <SidebarItem icon={<Home size={20} />} text="Home" />
            </Link>
            <li className="relative">
              <motion.div layout className="w-full">
                <button
                  onClick={() => setProfileExpanded((prev) => !prev)}
                  className="flex items-center w-full focus:outline-none"
                >
                  <SidebarItem icon={<User size={20} />} text="Profile" />
                  <motion.svg
                    animate={{ rotate: profileExpanded ? 180 : 0 }}
                    className="w-5 h-5 ml-auto transition-transform duration-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 0 01-1.414 0l-4-4a1 0 010-1.414z"
                      clipRule="evenodd"
                    ></path>
                  </motion.svg>
                </button>
              </motion.div>

              <AnimatePresence>
                {profileExpanded && (
                  <motion.ul
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="overflow-hidden pl-4 space-y-1"
                  >
                    <Link to="/account" onClick={handleSelect} className="flex items-center">
                      <SidebarItem icon={<User size={16} />} text="My Profile" />
                    </Link>
                    <Link to="/account/bookings" onClick={handleSelect} className="flex items-center">
                      <SidebarItem
                        icon={
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75z"
                            ></path>
                          </svg>
                        }
                        text="My Bookings"
                      />
                    </Link>
                    <Link to="/account/Mytrips" onClick={handleSelect} className="flex items-center">
                      <SidebarItem icon={<Car size={16} />} text="Create Trip Offer" />
                    </Link>
                    <Link to="/account/Myrequests" onClick={handleSelect} className="flex items-center">
                      <SidebarItem icon={<PersonStandingIcon size={16} />} text="Request Trip" />
                    </Link>
                  </motion.ul>
                )}
              </AnimatePresence>
            </li>
            <Link to="/account/trips" onClick={handleSelect} className="flex items-center">
              <SidebarItem icon={<Car size={20} />} text="Trips" />
            </Link>
            <Link to="/account/requests" onClick={handleSelect} className="flex items-center">
              <SidebarItem icon={<PersonStandingIcon size={20} />} text="Requests" />
            </Link>
            <Link to="/about" onClick={handleSelect} className="flex items-center">
              <SidebarItem icon={<Info size={20} />} text="About" />
            </Link>
            {expanded && children}
          </ul>
        </SidebarContext.Provider>

        {expanded && (
          <div className="flex flex-col p-3">
            <button
              onClick={handleAuthClick}
              className="mb-3 px-3 py-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600"
            >
              {user ? "Logout" : "Login"}
            </button>
            {user && (
              <div className="flex justify-between items-center transition-all">
                <div className="leading-4">
                  <h4 className="font-semibold">{user.name}</h4>
                  <span className="text-xs text-gray-600">{user.email}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </nav>
    </aside>
  );
}

export function SidebarItem({ icon, text, active, alert }) {
  const { expanded } = useContext(SidebarContext);

  return (
    <li
      className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group ${
        active
          ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
          : "hover:bg-indigo-50 text-gray-600"
      }`}
    >
      {expanded && icon}
      <span
        className={`overflow-hidden transition-all ${
          expanded ? "w-45 ml-2" : "w-0"
        }`}
      >
        {text}
      </span>
      {alert && (
        <div
          className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${
            expanded ? "" : "top-2"
          }`}
        />
      )}
      {!expanded && (
        <div
          className="absolute left-full rounded-md px-2 py-1 ml-6 bg-indigo-100 text-indigo-800 text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0"
        >
          {text}
        </div>
      )}
    </li>
  );
}
