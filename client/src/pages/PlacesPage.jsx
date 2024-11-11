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

export default function PlacesPage() {
  const { user } = useContext(UserContext);
  const [places, setPlaces] = useState([]);
  const [verificationMessage, setVerificationMessage] = useState("");
  const [expandedPlaces, setExpandedPlaces] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('/user-places', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(({ data }) => {
        setPlaces(data);
      })
      .catch(error => {
        if (error.response && error.response.status === 401) {
          console.error('JWT Token not provided or expired');
        } else {
          console.error('Error fetching user places:', error.response ? error.response.data : error.message);
        }
      });
    }
  }, []);

  const handleAddTripClick = (event) => {
    if (user) {
      if (user.verification === "not verified") {
        event.preventDefault();
        setVerificationMessage("Only verified users can create trip offers.");
        return;
      } else if (!user.isDriver) {
        event.preventDefault();
        setVerificationMessage("Only drivers can create trip offers.");
        return;
      }
      navigate('/account/Mytrips/new');
    }
  };

  const handleDeleteClick = (id) => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.delete(`/places/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(() => {
        setPlaces(places.filter((place) => place._id !== id));
      })
      .catch(error => {
        console.error('Error deleting place:', error);
      });
    }
  };

  const handleExpandClick = (id) => {
    setExpandedPlaces((prevExpanded) => ({
      ...prevExpanded,
      [id]: !prevExpanded[id],
    }));
  };

  const handleToggleStatus = (id, currentStatus) => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.put(`/places/${id}/status`, {
        status: currentStatus === 'active' ? 'hidden' : 'active'
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(({ data }) => {
        setPlaces(places.map(place => place._id === id ? { ...place, status: data.status } : place));
      })
      .catch(error => {
        console.error('Error updating place status:', error);
      });
    }
  };

  return (
    <div className="max-w-full mx-auto px-4 mt-20">
      {/* Heading Section */}
      <div className="text-center mt-10 mb-6">
        <h1 className="text-3xl font-bold text-gray-800">My Trip Offers</h1>
        <p className="text-gray-600 mt-2">Manage and view all your trip offers here.</p>
      </div>

      <div className="text-center mb-4 mt-8">
        <Link
          className="inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full"
          to={'/account/Mytrips/new'}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
          </svg>
          Add Trip Offer
        </Link>
      </div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="trip offers table">
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
            {places.length > 0 ? (
              places.map((place) => (
                <TableRow key={place._id}>
                  <TableCell>{place.province}, {place.from}</TableCell>
                  <TableCell>{place.province2}, {place.destination}</TableCell>
                  <TableCell>R{place.price} per person</TableCell>
                  <TableCell>{new Date(place.date).toLocaleDateString('en-US')}</TableCell>
                  <TableCell>
                    <div className={`w-max font-bold py-1 px-2 rounded-md ${place.status === 'active' ? 'bg-green-500/20 text-green-900' : 'bg-red-500/20 text-red-900'}`}>
                      {place.status}
                    </div>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      onClick={() => handleDeleteClick(place._id)}
                      aria-label="delete"
                      size="large"
                    >
                      <DeleteIcon fontSize="inherit" />
                    </IconButton>
                    <button
                      onClick={() => handleToggleStatus(place._id, place.status)}
                      className={`ml-2 px-2 py-1 rounded-lg ${place.status === 'active' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}
                    >
                      {place.status === 'active' ? 'Hide' : 'Activate'}
                    </button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No Trip Offers Found. Please Add Some.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
