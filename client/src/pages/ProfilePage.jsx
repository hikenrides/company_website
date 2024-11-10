import React, { useContext, useState } from 'react';
import { UserContext } from '../UserContext.jsx';
import { Link, Navigate, useParams } from 'react-router-dom';
import axios from 'axios';
import PlacesPage from './PlacesPage';
import AccountNav from '../AccountNav';
import RequestsPage from './RequestsPage.jsx';
import DepositPage from './DepositPage.jsx';
import { Button } from 'reactstrap';

const ProfilePage = () => {
  const [redirect, setRedirect] = useState(null);
  const { ready, user, setUser } = useContext(UserContext);
  const [paystackError, setPayStackError] = useState(false);

  const handlePayStackClick = () => {
    // Redirect the user to the PayStack payment page
    window.location.href = "https://paystack.com/pay/jmk8k9skzp";
    // Set the paystackError state to false (assuming it should be reset after redirection)
    setPayStackError(false);
  };
  let { subpage } = useParams();
  if (subpage === undefined) {
    subpage = 'profile';
  }

  {/*async function logout() {
    await axios.post('/logout', { withCredentials: true });
    setRedirect('/');
    setUser(null);
  }*/}

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
    <div className="mb-64 mt-20 max-w-7xl mx-auto px-4">
      {/*<div className="hidden md:block">
        <AccountNav />
      </div>*/}
      {subpage === 'profile' && (
        <div className="bg-white overflow-hidden shadow rounded-lg border max-w-2xl mx-auto">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              User Profile
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Basic information about the user.
            </p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              <ProfileField label="Full Name" value={user.name} />
              <ProfileField label="Email Address" value={user.email} />
              <ProfileField label="Gender" value={user.gender} />
              <ProfileField label="Phone Number" value={`0${user.phone_number}`} />
              <ProfileField label="Age" value={user.age} />
              <ProfileField
                label="Verification Status"
                value={user.verification}
                style={getVerificationValueStyle(user.verification)}
              />
              <ProfileField label="Balance" value={`R${user.balance}`} />

              <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Actions</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <div className="flex flex-col gap-2">
                    {user.verification !== 'verified' && (
                      <Link
                        to="/verification"
                        className="bg-gray-400 text-white py-2 px-4 rounded-full"
                      >
                        Verify Account
                      </Link>
                    )}
                    <Button
                      onClick={handlePayStackClick}
                      className="bg-gray-400 text-white py-2 px-4 rounded-full"
                    >
                      Deposit
                    </Button>
                    <Link
                      to="/withdraw"
                      className="bg-gray-400 text-white py-2 px-4 rounded-full"
                    >
                      Withdraw
                    </Link>
                    {/*<button
                      onClick={logout}
                      className="bg-red-600 text-white py-2 px-4 rounded-full mt-2"
                    >
                      Logout
                    </button>*/}
                  </div>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      )}
      {subpage === 'places' && <PlacesPage />}
      {subpage === 'requests' && <RequestsPage />}
      {subpage === 'deposit' && <DepositPage />}
      {subpage === 'withdraw' && <WithdrawPage />}
    </div>
  );
};

const ProfileField = ({ label, value, style }) => (
  <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
    <dt className="text-sm font-medium text-gray-500">{label}</dt>
    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2" style={style}>
      {value}
    </dd>
  </div>
);

export default ProfilePage;
