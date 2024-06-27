import { Link } from "react-router-dom";
import AccountNav from "../AccountNav";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../UserContext";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function PlacesPage() {
  const { user } = useContext(UserContext);
  const [places, setPlaces] = useState([]);
  const [verificationMessage, setVerificationMessage] = useState("");
  const [expandedPlaces, setExpandedPlaces] = useState({}); // Object to store expanded place IDs

  useEffect(() => {
    axios.get('/user-places', { withCredentials: true }).then(({ data }) => {
      setPlaces(data);
    });
  }, []);

  const handleAddTripClick = (event) => {
    if (user && user.verification === "not verified") {
      event.preventDefault();
      setVerificationMessage("Only verified users can create trip offers.");
    } else {
      // Proceed to navigate to add trip offer page
    }
  };

  const handleDeleteTrip = (placeId) => {
    axios.delete(`/places/${placeId}`, { withCredentials: true })
      .then(() => {
        setPlaces(places.filter(place => place._id !== placeId));
      })
      .catch(err => console.error('Error deleting place:', err));
  };

  const toggleExpandPlace = (placeId) => {
    setExpandedPlaces(prevExpanded => ({
      ...prevExpanded,
      [placeId]: !prevExpanded[placeId], // Toggle expansion state for the place
    }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '60vh' }}>
      <div className="hidden md:block mb-4">
        <AccountNav />
      </div>
      <div className="text-center mb-4">
        <Link
          className="inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full"
          to={'/account/Mytrips/new'}
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
        </Link>
        {verificationMessage && (
          <p className="text-red-700 mt-2">{verificationMessage}</p>
        )}
      </div>
      <div className="flex flex-wrap gap-4">
        {places.length > 0 &&
          places
            .filter(place => place.status !== 'deleted')  // Filter out deleted places
            .map((place) => (
              <div key={place._id} className="w-full flex cursor-pointer shadow-md rounded-2xl overflow-hidden p-4 mb-4" style={{ backgroundColor: 'white' }}>
                <Link to={`/account/places/${place._id}`} className="flex-grow" onClick={() => toggleExpandPlace(place._id)}>
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
                </Link>
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
