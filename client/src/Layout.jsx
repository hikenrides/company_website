import React from "react";
import Header from "./Header";
import { Outlet } from "react-router-dom";

const Layout = () => {
  const layoutStyle = {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh", // Ensure at least viewport height
    background: "linear-gradient(135deg, #FFE53B 0%, #FF2525 74%)",
  };

  const contentStyle = {
    flex: 1, // Allow content to take remaining space
  };

  return (
    <div style={layoutStyle}>
      <Header />
      <div style={contentStyle}>
        <Outlet />
      </div>
     
    </div>
  );
};

export default Layout;
