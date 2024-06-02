import React, { useContext, useState } from 'react';
import { UserContext } from '../UserContext.jsx';
import { Link, Navigate, useParams } from 'react-router-dom';
import axios from 'axios';
import PlacesPage from './PlacesPage';
import AccountNav from '../AccountNav';
import RequestsPage from './RequestsPage.jsx';
import DepositPage from './DepositPage.jsx'; // Added
import WithdrawPage from './WithdrawPage.jsx'; // Added
import VerificationModal from './VerificationModal.jsx'; // Add this import

const ProfilePage = () => {
  const [redirect, setRedirect] = useState(null);
  const [showVerificationModal, setShowVerificationModal] = useState(false); // Add this state
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

  // Define the style for the verification status value
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
          Logged in as {user.name} ({user.email})<br />
          <h2 className="text-l">Verification Status: <span style={getVerificationValueStyle(user.verification)}>{user.verification}</span></h2>
          <h2 className="text-xl" style={{ color: 'black', marginRight: '8px' }}>Balance: R{user.balance}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Link to="/deposit" className="bg-gray-400 text-white inline-flex gap-1 py-2 px-6 rounded-full max-w-sm mt-2">Deposit</Link>
            <Link to="/withdraw" className="bg-gray-400 text-white inline-flex gap-1 py-2 px-6 rounded-full max-w-sm mt-2">Withdraw</Link>
            <button onClick={logout} className="primary max-w-sm mt-10">Logout</button>
            <button onClick={() => setShowVerificationModal(true)} className="bg-blue-500 text-white inline-flex gap-1 py-2 px-6 rounded-full max-w-sm mt-2">Verify Account</button>
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
      {showVerificationModal && <VerificationModal onClose={() => setShowVerificationModal(false)} />} {/* Add this line */}
    </div>
  );
};

export default ProfilePage;
