import AccountNav from "../AccountNav";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import AddressLink from "../AddressLink";
import { useMediaQuery } from "react-responsive";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  useEffect(() => {
    axios.get('/bookings', { withCredentials: true }).then(response => {
      setBookings(response.data);
      setLoading(false);
    });
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '60vh', marginTop: '60px' }}>
      {/* Optional Account Navigation */}
      {/* {!isMobile && <AccountNav />} */}

      {/* Heading Section */}
      <div className="text-center mt-10 mb-6">
        <h1 className="text-3xl font-bold text-gray-800">My Bookings</h1>
        <p className="text-gray-600 mt-2">Manage and view all your Bookings here.</p>
      </div>

      {/* Main Content Section */}
      <div className="flex items-center justify-center mt-8">
        {loading ? (
          <p>Loading...</p>
        ) : bookings.length > 0 ? (
          <div className="overflow-x-auto w-full">
            <table className="min-w-full bg-white shadow-md rounded-xl">
              <thead>
                <tr className="bg-blue-gray-100 text-gray-700">
                  <th className="py-3 px-4 text-left">Pick-up Area</th>
                  <th className="py-3 px-4 text-left">Destination</th>
                  <th className="py-3 px-4 text-left">Total Price</th>
                  <th className="py-3 px-4 text-left">Action</th>
                </tr>
              </thead>
              <tbody className="text-blue-gray-900">
                {bookings.map((booking) => (
                  <tr key={booking._id} className="border-b border-blue-gray-200">
                    <td className="py-3 px-4">
                      <AddressLink className="block">
                        {booking.place ? booking.place.from : 'N/A'}
                      </AddressLink>
                    </td>
                    <td className="py-3 px-4">
                      <AddressLink className="block">
                        {booking.place ? booking.place.destination : 'N/A'}
                      </AddressLink>
                    </td>
                    <td className="py-3 px-4">
                      R{booking.price * booking.passengers}
                    </td>
                    <td className="py-3 px-4">
                      <Link to={`/account/bookings/${booking._id}`} className="font-medium text-blue-600 hover:text-blue-800">
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>You have not yet made any bookings.</p>
        )}
      </div>
    </div>
  );
}
