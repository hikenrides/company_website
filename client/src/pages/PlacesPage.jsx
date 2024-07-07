import { Link, useNavigate } from "react-router-dom";
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
          setVerificationMessage("You need to verify your email first.");
        }
      });
    }
  }, []);

  const handleAddTripClick = (event) => {
    if (user && user.verification === "not verified") {
      event.preventDefault();
      setVerificationMessage("Only verified users can create trip offers.");
    } else {
      // Proceed to navigate to add trip offer page
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
      .then(({ data }) => {
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
      <div className="text-center">
        <div>
          <div className="mt-4">
            {places.length > 0 ? (
              places.map((place) => (
                <div
                  key={place._id}
                  className={`bg-gray-200 p-4 mb-4 rounded-lg shadow-md ${expandedPlaces[place._id] ? "expanded" : ""}`}
                >
                  <div className="text-left">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <strong className="text-xl font-medium" style={{ color: 'orange', marginRight: '8px' }}>pick-up area:</strong>
                      <span>{place.province}, {place.from}</span>
                    </div>
                    <hr style={{ border: '1px solid gray' }} />
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <strong className="text-xl font-medium" style={{ color: 'orange', marginRight: '8px' }}>destination:</strong>
                      <span>{place.province2}, {place.destination}</span>
                    </div>
                    <hr style={{ border: '1px solid gray' }} />
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <strong style={{ color: 'orange', marginRight: '8px' }}>price:</strong>
                      <span>{place.price} per person</span>
                    </div>
                    <hr style={{ border: '1px solid gray' }} />
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <strong className="text-sm mt-2" style={{ color: 'orange', marginRight: '8px' }}>date:</strong>
                      <span>{new Date(place.date).toLocaleDateString('en-US')}</span>
                    </div>
                    <hr style={{ border: '1px solid gray' }} />
                    {expandedPlaces[place._id] && (
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <strong className="text-xl font-medium" style={{ color: 'orange', marginRight: '8px' }}>vehicle-destination:</strong>
                          <span>{place.brand}, {place.color}, {place.type}</span>
                        </div>
                        <hr style={{ border: '1px solid gray' }} />
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <p><strong style={{ color: 'orange', marginRight: '8px' }}>Extra Info:</strong> {place.extraInfo}</p>
                        </div>
                        <hr style={{ border: '1px solid gray' }} />
                      </div>
                    )}
                  </div>
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={() => handleExpandClick(place._id)}
                      className="bg-blue-500 text-white px-2 py-1 rounded-lg hover:bg-blue-600 mr-2"
                    >
                      {expandedPlaces[place._id] ? "Show Less" : "Show More"}
                    </button>
                    <IconButton
                      onClick={() => handleDeleteClick(place._id)}
                      aria-label="delete"
                      size="large"
                    >
                      <DeleteIcon fontSize="inherit" />
                    </IconButton>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center">
                <p>No Trip offers found. Please add some trip offers</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
