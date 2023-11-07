import { useContext, useState } from "react";
import { UserContext } from "../UserContext.jsx";
import { Link, Navigate, useParams } from "react-router-dom";
import axios from "axios";
import PlacesPage from "./PlacesPage";
import AccountNav from "../AccountNav";
import RequestsPage from "./RequestsPage.jsx";

export default function ProfilePage() {
  const [redirect, setRedirect] = useState(null);
  const { ready, user, setUser } = useContext(UserContext);
  let { subpage } = useParams();
  if (subpage === undefined) {
    subpage = 'profile';
  }

  async function logout() {
    await axios.post('/logout');
    setRedirect('/');
    setUser(null);
  }

  function deposit() {
    // Add your logic for deposit functionality here
  }

  if (!ready) {
    return 'Loading...';
  }

  if (ready && !user && !redirect) {
    return <Navigate to={'/login'} />;
  }

  if (redirect) {
    return <Navigate to={redirect} />;
  }
  return (
    <div>
      <AccountNav />
      {subpage === 'profile' && (
        <div className="text-center max-w-lg mx-auto text-white">
          Logged in as {user.name} ({user.email})<br />
          <h2 className="text-xl" style={{ color: 'black', marginRight: '8px' }}>Balance: R0</h2>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <button onClick={deposit} className="bg-gray-400 text-white inline-flex gap-1 py-2 px-6 rounded-full max-w-sm mt-2">Deposit</button>
            <button onClick={logout} className="primary max-w-sm mt-10">Logout</button>
          </div>
        </div>
      )}
      {subpage === 'places' && (
        <PlacesPage />
      )}
      {subpage === 'requests' && (
        <RequestsPage />
      )}
    </div>
  );
}
