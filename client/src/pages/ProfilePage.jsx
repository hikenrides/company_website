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
  const [picture, setPicture] = useState(null);
  const [document, setDocument] = useState(null);
  let { subpage } = useParams();
  if (subpage === undefined) {
    subpage = 'profile';
  }

  async function logout() {
    await axios.post('/logout', { withCredentials: true });
    setRedirect('/');
    setUser(null);
  }

  async function handleFileUpload(e) {
    e.preventDefault();

    const formData = new FormData();
    if (picture) formData.append('picture', picture);
    if (document) formData.append('document', document);

    try {
      const response = await axios.post('/upload', formData, { withCredentials: true });
      setUser(response.data); // Update user context with new data
      alert('Files uploaded successfully');
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Failed to upload files');
    }
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
          </div>

          <form onSubmit={handleFileUpload} className="mt-4">
            <div className="mb-2">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Upload Picture
              </label>
              <input type="file" onChange={(e) => setPicture(e.target.files[0])} />
            </div>
            <div className="mb-2">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Upload Document
              </label>
              <input type="file" onChange={(e) => setDocument(e.target.files[0])} />
            </div>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
              Upload
            </button>
          </form>

        </div>
      )}
      {subpage === 'places' && <PlacesPage />}
      {subpage === 'requests' && <RequestsPage />}
      {subpage === 'deposit' && <DepositPage />}
      {subpage === 'withdraw' && <WithdrawPage />}
    </div>
  );
};

export default ProfilePage;
