import AccountNav from "../AccountNav";
import {useEffect, useState} from "react";
import axios from "axios";
import {Link} from "react-router-dom";
import AddressLink from "../AddressLink";


export default function BookingsPage() {
  const [bookings,setBookings] = useState([]);
  useEffect(() => {
    axios.get('/bookings', { withCredentials: true }).then(response => {
      setBookings(response.data);
    });
  }, []);
  return (
    <div className="hidden md:block">
      <AccountNav />
      <div>
        {bookings?.length > 0 && bookings.map(booking => (
          <Link to={`/account/bookings/${booking._id}`} className="flex gap-4 bg-gray-300 rounded-2xl overflow-hidden mt-6">
            <div className="py-3 pr-3 grow">
              <AddressLink className="my-2 block">
              <span style={{color: '#FF8C00'}}>pick-up area:  </span>{booking.place.from}
              </AddressLink>
              <AddressLink className="my-2 block">
              <span style={{color: '#FF8C00'}}>Destination:  </span>{booking.place.destination}
              </AddressLink>
              
              <div className="text-xl">
                <div className="flex gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                  </svg>
                  <h2 className="text-2xl">
                    <span style={{color: '#FF8C00'}}>Total price: </span>R{booking.place.price * booking.passengers}
                  </h2>
                </div>
              </div>
            </div>
            <h1>Tap for more info</h1>
          </Link>
        ))}
      </div>
    </div>
  );
}

