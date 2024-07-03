import { useNavigate } from "react-router-dom";
import AccountNav from "../AccountNav";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../UserContext";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

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
          // Handle unauthorized access
          console.error('JWT Token not provided or expired');
          // Redirect to login or handle as needed
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
      navigate('/account/Mytrips/new'); // This line should navigate to the page if all checks pass
    }
  };

  const handleDeleteTrip = (placeId) => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.delete(`/places/${placeId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(() => {
        setPlaces(places.filter(place => place._id !== placeId));
      })
      .catch(err => console.error('Error deleting place:', err));
    }
  };

  const toggleExpandPlace = (placeId) => {
    setExpandedPlaces(prevExpanded => ({
      ...prevExpanded,
      [placeId]: !prevExpanded[placeId],
    }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '60vh' }}>
      <div className="hidden md:block mb-4">
        <AccountNav />
      </div>
      <div className="text-center mb-4">
        <button
          className="inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full"
          onClick={handleAddTripClick}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
          </svg>
          Add trip offer
        </button>
        {verificationMessage && (
          <p className="text-red-700 mt-2">{verificationMessage}</p>
        )}
      </div>
      <div className="flex flex-wrap gap-4">
        {places.length > 0 &&
          places
            .filter(place => place.status !== 'deleted')
            .map((place) => (
              <div key={place._id} className="w-full flex cursor-pointer shadow-md rounded-2xl overflow-hidden p-4 mb-4" style={{ backgroundColor: 'white' }}>
                <div className="flex-grow">
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <h2 className="text-xl font-medium" style={{ color: 'orange', marginRight: '8px' }}>pick-up area:</h2>
                    <span>{place.province}, {place.from}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <h2 className="text-xl font-medium" style={{ color: 'orange', marginRight: '8px' }}>destination:</h2>
                    <span>{place.province2}, {place.destination}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <h2 style={{ color: 'orange', marginRight: '8px' }}>price:</h2>
                    <span>{place.price} per person</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <p className="text-sm mt-2" style={{ color: 'orange', marginRight: '8px' }}>date:</p>
                    <span>{new Date(place.date).toLocaleDateString('en-US')}</span>
                  </div>
                </div>
                <button onClick={() => handleDeleteTrip(place._id)} className="ml-4 text-red-500 hover:text-red-700">
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
