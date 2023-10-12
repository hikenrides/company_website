import Header from "./Header";
import { Outlet } from "react-router-dom";

export default function Layout() {
  const layoutStyle = {
    background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
    padding: "1rem", // Adjust the padding as needed
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
  };

  return (
    <div style={layoutStyle}>
      <Header />
      <Outlet />
    </div>
  );
}
