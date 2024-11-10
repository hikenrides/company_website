import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect, useRef } from "react";
import { UserContext } from "./UserContext";
import { motion } from "framer-motion";

export default function Header() {
  const { user, setUser } = useContext(UserContext);
  const [openProfile, setOpenProfile] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  let menuRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        openProfile &&
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        event.target.closest(".user-container2") === null
      ) {
        setOpenProfile(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [openProfile]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  let easing = [0.6, -0.05, 0.01, 0.99];
  const header = {
    initial: { y: -60, opacity: 0, transition: { duration: 0.05, ease: easing } },
    animate: { y: 0, opacity: 1, animation: { duration: 0.6, ease: easing } },
  };

  return (
    <div className="flex flex-col items-center">
      <header className="flex justify-between fixed w-full z-40 backdrop-filter bg-opacity-80 shadow-md">
        <Link to="/" className="flex gap-1">
          <motion.div className="logo_wrapper" variants={header}>
            hike<span>n</span>rides
          </motion.div>
        </Link>

        {/*<div className="ml-auto mr-5 md:mr-20 flex items-center gap-2">
          {user ? (
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 text-sm md:px-4 md:py-2 md:text-base bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={handleLogin}
              className="px-3 py-1.5 text-sm md:px-4 md:py-2 md:text-base bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Login
            </button>
          )}
        </div>*/}

        <div
          className="user-container2 md:hidden flex items-center gap-2 py-1 px-1"
          onClick={() => setOpenProfile((prev) => !prev)}
          ref={menuRef}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="18"
            width="16"
            viewBox="0 0 448 512"
          >
            <path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z" />
          </svg>
        </div>
      </header>
    </div>
  );
}
