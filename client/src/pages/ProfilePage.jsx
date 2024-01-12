import React, { useContext, useState } from 'react';
import { UserContext } from '../UserContext.jsx';
import { Link, Navigate, useParams } from 'react-router-dom';
import axios from 'axios';
import PlacesPage from './PlacesPage';
import AccountNav from '../AccountNav';
import RequestsPage from './RequestsPage.jsx';
import DepositPage from './DepositPage.jsx'; // Added
import WithdrawPage from './WithdrawPage.jsx'; // Added

const ProfilePage = () => {
  const [redirect, setRedirect] = useState(null);
  const { ready, user, setUser } = useContext(UserContext);
  let { subpage } = useParams();
  if (subpage === undefined) {
    subpage = 'profile';
  }

  async function logout() {
    await axios.post('/logout', { withCredentials: true });
    setRedirect('/');
    setUser(null);
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
    <div className="mb-64">
      <div className="hidden md:block">
        <AccountNav />
      </div>
      {subpage === 'profile' && (
        <div className="text-center max-w-lg mx-auto text-white">
          Logged in as {user.name} ({user.email})<br />
          <h2 className="text-xl" style={{ color: 'black', marginRight: '8px' }}>Balance: R{user.balance}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Link to="/deposit" className="bg-gray-400 text-white inline-flex gap-1 py-2 px-6 rounded-full max-w-sm mt-2">Deposit</Link>
            <Link to="/withdraw" className="bg-gray-400 text-white inline-flex gap-1 py-2 px-6 rounded-full max-w-sm mt-2">Withdraw</Link>
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
      {subpage === 'deposit' && (
        <DepositPage />
      )}
      {subpage === 'withdraw' && (
        <WithdrawPage />
      )}
    </div>
  );
};

export default ProfilePage;
