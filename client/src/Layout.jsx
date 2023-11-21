import React from "react";
import Header from "./Header";
import { Outlet } from "react-router-dom";

const Layout = () => {
  const layoutStyle = {
    background: "linear-gradient(135deg, #FFE53B 0%, #FF2525 74%)",
    padding: "1rem", // Adjust the padding as needed
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    width: "100%",
    position: "relative", // Ensure proper positioning of the notification icon
  };

  const notificationStyle = {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    width: "50px",
    height: "50px",
    background: "#4CAF50", // Adjust the background color of the notification icon
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#ffffff",
    fontSize: "24px",
    cursor: "pointer",
    zIndex: 999, // Ensure the notification icon stays on top of other elements
  };

  const handleNotificationClick = () => {
    // Handle the notification click event
    // Implement your logic for showing notifications or other actions
  };

  return (
    <div style={layoutStyle}>
      <Header />
      <Outlet />
      <div style={notificationStyle} onClick={handleNotificationClick}>
        {/* You can replace the content with your own icon or notification */}
        <span>🔔</span>
      </div>
    </div>
  );
};

export default Layout;
