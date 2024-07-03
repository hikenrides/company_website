import { Link } from "react-router-dom";
import AccountNav from "../AccountNav";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../UserContext";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

export default function RequestsPage() {
  const { user } = useContext(UserContext);
  const [requests, setRequests] = useState([]);
  const [verificationMessage, setVerificationMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    axios.get('/requested-trips', config).then(({ data }) => {
      setRequests(data.filter(request => request.status !== 'deleted')); 
    });
  }, []);

  const handleAddRequestClick = (event) => {
    if (user && user.verification === "not verified") {
      event.preventDefault();
      setVerificationMessage("Only verified users can create trip requests.");
    } else {
      // Proceed to navigate to add trip request page
    }
  };

  const handleDeleteRequest = (requestId) => {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    axios.delete(`/requests/${requestId}`, config)
      .then(() => {
        setRequests(requests.filter(request => request._id !== requestId));
      })
      .catch(err => console.error('Error deleting request:', err));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '60vh' }}>
      <div className="hidden md:block mb-4">
        <AccountNav />
      </div>
      <div className="mb-4">
        <Link
          className="inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full"
          to={'/account/Myrequests/new'}
          onClick={handleAddRequestClick}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
          </svg>
          Add trip request
        </Link>
        {verificationMessage && (
          <p className="text-red-700 mt-2">{verificationMessage}</p>
        )}
      </div>
      <div className="flex flex-wrap gap-4">
        {requests.length > 0 &&
          requests.map((request) => (
            <div key={request._id} className="w-full flex cursor-pointer shadow-md rounded-2xl overflow-hidden p-4 mb-4" style={{ backgroundColor: 'white' }}>
              <div className="flex-grow">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <h2 className="text-xl font-medium" style={{ color: 'orange', marginRight: '8px' }}>pick-up area:</h2>
                  <span>{request.from}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <h2 className="text-xl font-medium" style={{ color: 'orange', marginRight: '8px' }}>destination:</h2>
                  <span>{request.destination}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <h2 style={{ color: 'orange', marginRight: '8px' }}>price:</h2>
                  <span>{request.price} per person</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <p className="text-sm mt-2" style={{ color: 'orange', marginRight: '8px' }}>date:</p>
                  <span>{new Date(request.date).toLocaleDateString('en-US')}</span>
                </div>
              </div>
              <button onClick={() => handleDeleteRequest(request._id)} className="ml-4 text-red-500 hover:text-red-700">
                <IconButton aria-label="delete">
                  <DeleteIcon />
                </IconButton>
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}

