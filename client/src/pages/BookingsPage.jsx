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
    axios.get('/bookings', { withCredentials: true }).then((response) => {
      setBookings(response.data);
      setLoading(false);
    });
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "60vh", marginTop: "60px" }}>
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
          <div className="w-full px-4">
            {!isMobile ? (
              <table className="min-w-full bg-white shadow-md rounded-xl">
                <thead>
                  <tr className="bg-blue-gray-100 text-gray-700">
                    <th className="py-3 px-4 text-left">Pick-up Area</th>
                    <th className="py-3 px-4 text-left">Destination</th>
                    <th className="py-3 px-4 text-left">Total Price</th>
                  </tr>
                </thead>
                <tbody className="text-blue-gray-900">
                  {bookings.map((booking, index) => (
                    <tr
                      key={booking._id}
                      className={`border-b border-blue-gray-200 ${index % 2 === 0 ? "bg-gray-100" : "bg-gray-200"}`}
                    >
                      <td className="py-3 px-4">
                        <Link to={`/account/bookings/${booking._id}`} className="block hover:underline">
                          <AddressLink className="block">
                            {booking.place ? booking.place.from : "N/A"}
                          </AddressLink>
                        </Link>
                      </td>
                      <td className="py-3 px-4">
                        <Link to={`/account/bookings/${booking._id}`} className="block hover:underline">
                          <AddressLink className="block">
                            {booking.place ? booking.place.destination : "N/A"}
                          </AddressLink>
                        </Link>
                      </td>
                      <td className="py-3 px-4">
                        <Link to={`/account/bookings/${booking._id}`} className="block hover:underline">
                          R{booking.price * booking.passengers}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <Link
                    to={`/account/bookings/${booking._id}`}
                    key={booking._id}
                    className="block bg-white shadow-md rounded-xl p-4 hover:shadow-lg transition-shadow"
                  >
                    <p className="text-gray-800 font-bold">
                      Pick-up Area: {booking.place ? booking.place.from : "N/A"}
                    </p>
                    <p className="text-gray-600 mt-1">
                      Destination: {booking.place ? booking.place.destination : "N/A"}
                    </p>
                    <p className="text-blue-gray-900 mt-1">
                      Total Price: R{booking.price * booking.passengers}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ) : (
          <p>You have not yet made any bookings.</p>
        )}
      </div>
    </div>
  );
}
