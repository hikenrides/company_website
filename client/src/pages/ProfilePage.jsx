import React, { useContext, useState } from 'react';
import { UserContext } from '../UserContext.jsx';
import { Link, Navigate, useParams } from 'react-router-dom';
import axios from 'axios';
import PlacesPage from './PlacesPage';
import AccountNav from '../AccountNav';
import RequestsPage from './RequestsPage.jsx';
import DepositPage from './DepositPage.jsx';
import WithdrawPage from './WithdrawPage.jsx';

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

  const getVerificationValueStyle = (status) => {
    switch (status) {
      case 'not verified':
        return { color: 'red' };
      case 'pending':
        return { color: 'orange' };
      case 'verified':
        return { color: 'green' };
      default:
        return { color: 'black' };
    }
  };

  return (
    <div className="mb-64">
      <div className="hidden md:block">
        <AccountNav />
      </div>
      {subpage === 'profile' && (
        <div className="text-center max-w-lg mx-auto text-white">
          Logged in as {user.name}<br />
          <hr style={{ border: '1px solid orange' }} />
          <h2 className="text-l">Email: <span>{user.email}</span></h2>
          <hr style={{ border: '1px solid orange' }} />
          <h2 className="text-l">Gender: <span>{user.gender}</span></h2>
          <hr style={{ border: '1px solid orange' }} />
          <h2 className="text-l">Phone number: <span>0{user.phone_number}</span></h2>
          <hr style={{ border: '1px solid orange' }} />
          <h2 className="text-l">Age: <span>{user.age}</span></h2>
          <hr style={{ border: '1px solid orange' }} />
          <h2 className="text-l">Verification Status: <span style={getVerificationValueStyle(user.verification)}>{user.verification}</span></h2>
          {user.verification !== 'verified' && (
            <Link to="/verification" className="bg-gray-400 text-white inline-flex gap-1 py-2 px-6 rounded-full max-w-sm mt-2">Verify Account</Link>
          )}
          <hr style={{ border: '1px solid orange' }} />
          <h2 className="text-xl text-black mt-4">Balance: R{user.balance}</h2>
          <div className="flex flex-col items-center mt-4">
            <Link to="/deposit" className="bg-gray-400 text-white inline-flex gap-1 py-2 px-6 rounded-full max-w-sm mt-2">Deposit</Link>
            <Link to="/withdraw" className="bg-gray-400 text-white inline-flex gap-1 py-2 px-6 rounded-full max-w-sm mt-2">Withdraw</Link>
            <button onClick={logout} className="bg-red-600 text-white py-2 px-6 rounded-full max-w-sm mt-10">Logout</button>
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
