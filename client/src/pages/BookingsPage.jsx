import AccountNav from "../AccountNav";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import AddressLink from "../AddressLink";

import { useMediaQuery } from "react-responsive"; // Import for media query hook

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    axios.get('/bookings', { withCredentials: true }).then(response => {
      setBookings(response.data);
      setLoading(false); // Set loading to false after fetching data
    });
  }, []);

  // Use media query hook to detect screen size
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" }); // Adjust breakpoint as needed

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '60vh' }}>
      <div className={`hidden md:block ${isMobile ? 'hidden' : ''}`}> {/* Conditionally render AccountNav on larger screens */}
        <AccountNav />
      </div>
      <div>
        {loading ? ( // Display loading indicator while fetching data
          <p>Loading...</p>
        ) : bookings.length > 0 ? ( // Check if there are bookings
          bookings.map(booking => (
            <Link key={booking._id} to={`/account/bookings/${booking._id}`} className={`flex gap-4 bg-gray-300 rounded-2xl overflow-hidden mt-6 ${isMobile ? 'flex-col items-center' : ''}`}>
              <div className={`py-3 pr-3 grow ${isMobile ? 'w-full' : ''}`}> {/* Adjust layout and width for mobile */}
                {booking.place && ( // Add null check for booking.place
                  <AddressLink className="my-2 block">
                    <span style={{ color: '#FF8C00' }}>pick-up area:  </span>{booking.place.from}
                  </AddressLink>
                )}
                {booking.place && ( // Add null check for booking.place
                  <AddressLink className="my-2 block">
                    <span style={{ color: '#FF8C00' }}>Destination:  </span>{booking.place.destination}
                  </AddressLink>
                )}
                <div className="text-xl">
                  <div className="flex gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-8 h-8 ${isMobile ? 'w-6 h-6' : ''}`}> {/* Adjust icon size for mobile */}
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                    </svg>
                    <h2 className={`text-2xl ${isMobile ? 'text-xl' : ''}`}> {/* Adjust heading size for mobile */}
                      <span style={{ color: '#FF8C00' }}>Total price: </span>R{booking.price * booking.passengers}
                    </h2>
                  </div>
                </div>
              </div>
              {!isMobile && ( // Render "Tap for more info" only on larger screens */}
                <h1>Tap for more info</h1>
              )}
            </Link>
          ))
        ) : (
          <p >You have not yet made any bookings.</p> // Display message when no bookings
        )}
      </div>
    </div>
  );
}
