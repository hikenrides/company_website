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
      navigate('/account/Mytrips/new'); // This line should navigate to the page if all checks pass
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
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '60vh' }}>
      <div className="hidden md:block mb-4">
        <AccountNav />
      </div>
      <div className="text-center mb-4 mt-4">
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
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <strong className="text-xl font-medium" style={{ color: 'orange', marginRight: '8px' }}>Max passengers:</strong>
                          <span>{place.maxGuests}</span>
                        </div>
                        <hr style={{ border: '1px solid gray' }} />
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <strong className="text-xl font-medium" style={{ color: 'orange', marginRight: '8px' }}>Trip frequency:</strong>
                          <span>{place.frequency}</span>
                        </div>
                        <hr style={{ border: '1px solid gray' }} />
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <strong className="text-xl font-medium" style={{ color: 'orange', marginRight: '8px' }}>Trip status:</strong>
                          <span>{place.status}</span>
                          <button
                            onClick={() => handleToggleStatus(place._id, place.status)}
                            className="ml-2 bg-green-500 text-white px-2 py-1 rounded-lg hover:bg-green-600"
                          >
                            {place.status === 'active' ? 'Hide' : 'Activate'}
                          </button>
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
