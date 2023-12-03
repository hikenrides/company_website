import { Link } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "./UserContext.jsx";
import { motion } from "framer-motion";
import $ from 'jquery';

export default function Header() {
  const { user } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState("");

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

  useEffect(() => {
    
    animation();
    $(window).on('resize', function(){
      setTimeout(function(){ animation(); }, 500);
    });
    
  }, []);

  function animation(){
    var tabsNewAnim = $('#navbarSupportedContent');
    var activeItemNewAnim = tabsNewAnim.find('.active');
    var activeWidthNewAnimHeight = activeItemNewAnim.innerHeight();
    var activeWidthNewAnimWidth = activeItemNewAnim.innerWidth();
    var itemPosNewAnimTop = activeItemNewAnim.position();
    var itemPosNewAnimLeft = activeItemNewAnim.position();
    $(".hori-selector").css({
      "top":itemPosNewAnimTop.top + "px", 
      "left":itemPosNewAnimLeft.left + "px",
      "height": activeWidthNewAnimHeight + "px",
      "width": activeWidthNewAnimWidth + "px"
    });
    $("#navbarSupportedContent").on("click","li",function(e){
      $('#navbarSupportedContent ul li').removeClass("active");
      $(this).addClass('active');
      var activeWidthNewAnimHeight = $(this).innerHeight();
      var activeWidthNewAnimWidth = $(this).innerWidth();
      var itemPosNewAnimTop = $(this).position();
      var itemPosNewAnimLeft = $(this).position();
      $(".hori-selector").css({
        "top":itemPosNewAnimTop.top + "px", 
        "left":itemPosNewAnimLeft.left + "px",
        "height": activeWidthNewAnimHeight + "px",
        "width": activeWidthNewAnimWidth + "px"
      });
    });
  }


  return (
    <div className="flex flex-col items-center">
      <header className="flex justify-between">
        <Link to={"/"} className="flex gap-1">
          <motion.div className="logo_wrapper" variants={header}>
            hike<span>n</span>rides
          </motion.div>
        </Link>

        <Link
          to={user ? "/account" : "/login"}
          className="flex items-center gap-2 border border-gray-300 rounded-full py-2 px-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 text-white"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
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
      </header>
      <ul className="navbar-nav ml-auto">
      <div className="tab-container flex gap-2 border border-gray-300 rounded-full py-1 px-2 shadow-md shadow-gray-300">
      <div className="hori-selector">
              <div className="left"></div>
              <div className="right"></div>
            </div>

      <li className="nav-item">
        <Link to={"/account/trips"} className="nav-link">
          <div
            className={`flex text-white cursor-pointer ${
              activeTab === "tripOffers" ? "shadow-md shadow-gray-300" : ""
            }`}
            onClick={() => handleTabClick("tripOffers")}
          >
            Trips
          </div>
        </Link>
        </li>
        <div className="border-l border-gray-300" style={{ height: '20px', width: '3px' }}></div>
        <li className="nav-item">
        <Link to={"/account/requests"} className="nav-link">
          <div
            className={`flex text-white cursor-pointer ${
              activeTab === "requestedTrips" ? "shadow-md shadow-gray-300" : ""
            }`}
            onClick={() => handleTabClick("requestedTrips")}
          >
            Requests
          </div>
        </Link>
        </li>
      </div>
      </ul>
    </div>
  );
}
