import React from "react";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar"; // Import your Sidebar component

const Layout = () => {
  const layoutStyle = {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh", // Ensure at least viewport height
    background: "linear-gradient(135deg, #FFE53B 0%, #FF2525 74%)",
  };

  const contentStyle = {
    flex: 1, // Allow content to take remaining space
    position: "relative", // Set relative positioning for content area
  };

  return (
    <div style={layoutStyle}>
      <Sidebar /> {/* Move Sidebar above Header */}
      <Header />
      <div style={contentStyle}>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
