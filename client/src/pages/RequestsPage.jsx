import { Link, useNavigate } from "react-router-dom";
import AccountNav from "../AccountNav";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../UserContext";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function RequestsPage() {
  const { user } = useContext(UserContext);
  const [requests, setRequests] = useState([]);
  const [verificationMessage, setVerificationMessage] = useState("");
  const [expandedRequests, setExpandedRequests] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('/requested-trips', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(({ data }) => {
        setRequests(data.filter(request => request.status !== 'deleted'));
      })
      .catch(error => console.error('Error fetching requests:', error));
    }
  }, []);

  const handleAddRequestClick = (event) => {
    if (user) {
      if (user.verification === "not verified") {
        event.preventDefault();
        setVerificationMessage("Only verified users can create trip requests.");
        return;
      }
      setVerificationMessage(""); // Clear the message if the user is verified
      navigate('/account/Myrequests/new'); // Navigate to the new request page
    }
  };

  const handleDeleteRequest = (requestId) => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.delete(`/requests/${requestId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(() => {
        setRequests(requests.filter(request => request._id !== requestId));
      })
      .catch(err => console.error('Error deleting request:', err));
    }
  };

  const handleToggleStatus = (requestId, currentStatus) => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.put(`/requests/${requestId}/status`, {
        status: currentStatus === 'active' ? 'hidden' : 'active'
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(({ data }) => {
        setRequests(requests.map(request => request._id === requestId ? { ...request, status: data.status } : request));
      })
      .catch(err => console.error('Error toggling status:', err));
    }
  };

  const handleExpandClick = (id) => {
    setExpandedRequests((prevExpanded) => ({
      ...prevExpanded,
      [id]: !prevExpanded[id],
    }));
  };

  return (
    <div className="max-w-full mx-auto px-4 mt-20">
      {/* Page Heading */}
      <div className="text-center mt-10 mb-6">
        <h1 className="text-3xl font-bold text-gray-800">My Trip Requests</h1>
        <p className="text-gray-600 mt-2">Manage and view all your trip requests here.</p>
      </div>

      {/* Add Request Button */}
      <div className="text-center mb-4 mt-10">
        <button
          onClick={handleAddRequestClick}
          className="inline-flex items-center gap-1 bg-primary text-white py-2 px-6 rounded-full"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
          </svg>
          Add Trip Request
        </button>
        {verificationMessage && (
          <p className="text-red-700 mt-2">{verificationMessage}</p>
        )}
      </div>

      {/* Requests Table */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="trip requests table">
          <TableHead>
            <TableRow>
              <TableCell><strong>Pick-up Area</strong></TableCell>
              <TableCell><strong>Destination</strong></TableCell>
              <TableCell><strong>Price</strong></TableCell>
              <TableCell><strong>Date</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell align="center"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requests.length > 0 ? (
              requests.map((request, index) => (
                <TableRow 
                  key={request._id}
                  sx={{
                    backgroundColor: index % 2 === 0 ? '#f7f7f7' : '#e0e0e0'
                  }}
                >
                  <TableCell>{request.province}, {request.from}</TableCell>
                  <TableCell>{request.province2}, {request.destination}</TableCell>
                  <TableCell>R{request.price} per person</TableCell>
                  <TableCell>{new Date(request.date).toLocaleDateString('en-US')}</TableCell>
                  <TableCell>
                    <div className={`w-max font-bold py-1 px-2 rounded-md ${request.status === 'active' ? 'bg-green-500/20 text-green-900' : 'bg-red-500/20 text-red-900'}`}>
                      {request.status}
                    </div>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      onClick={() => handleDeleteRequest(request._id)}
                      aria-label="delete"
                      size="large"
                    >
                      <DeleteIcon fontSize="inherit" />
                    </IconButton>
                    <button
                      onClick={() => handleToggleStatus(request._id, request.status)}
                      className={`ml-2 px-2 py-1 rounded-lg ${request.status === 'active' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}
                    >
                      {request.status === 'active' ? 'Hide' : 'Activate'}
                    </button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No Trip Requests Found. Please Add Some.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
