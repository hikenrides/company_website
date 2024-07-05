import { Link, useNavigate } from "react-router-dom";
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
  const [expandedRequests, setExpandedRequests] = useState({});


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

 
  const handleExpandClick = (id) => {
    setExpandedRequests((prevExpanded) => ({
      ...prevExpanded,
      [id]: !prevExpanded[id],
    }));
  };

  return (
    <div>
      <div className="hidden md:block mb-4">
        <AccountNav />
      </div>
      <div className="mb-4">
        <Link
          className="inline-flex items-center gap-1 bg-primary text-white py-2 px-6 rounded-full"
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
      <div className="mt-4">
        {requests.length > 0 ? (
          requests.map((request) => (
            <div key={request._id} className={`bg-gray-200 p-4 mb-4 rounded-lg shadow-md ${expandedRequests[request._id] ? "expanded" : ""}`}>
              <div className="text-left">
                <p><strong>Pick-up Area:</strong> {request.from}</p>
                <p><strong>Destination:</strong> {request.destination}</p>
                <p><strong>Price:</strong> ${request.price} per person</p>
                <p><strong>Date:</strong> {new Date(request.date).toLocaleDateString()}</p>
                {expandedRequests[request._id] && (
                  <div>
                    <p><strong>Extra Info:</strong> {request.extraInfo}</p>
                  </div>
                )}
              </div>
              <div className="flex justify-end mt-2">
                <button
                  onClick={() => handleExpandClick(request._id)}
                  className="bg-blue-500 text-white px-2 py-1 rounded-lg hover:bg-blue-600 mr-2"
                >
                  {expandedRequests[request._id] ? "Show Less" : "Show More"}
                </button>
                <IconButton
                  onClick={() => handleDeleteRequest(request._id)}
                  aria-label="delete"
                  size="large"
                  className="text-red-500 hover:text-red-700"
                >
                  <DeleteIcon fontSize="inherit" />
                </IconButton>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center">
            <p>No requests found. Please add some requests.</p>
          </div>
        )}
      </div>
    </div>
  );
}
