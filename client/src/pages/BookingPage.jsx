import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import AddressLink from "../AddressLink";

export default function BookingPage() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    if (id) {
      axios.get('/bookings', { withCredentials: true }).then(response => {
        const foundBooking = response.data.find(({ _id }) => _id === id);
        if (foundBooking) {
          setBooking(foundBooking);
        }
      });
    }
  }, [id]);

  if (!booking) {
    return 'Loading...';
  }

  if (!booking.place) {
    return 'Booking place not found';
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const formattedDate = new Date(dateString).toLocaleDateString('en-US', options);
    return formattedDate;
  };

  return (
    <div className="my-8">
      <div className="bg-gray-300 p-6 my-6 rounded-2xl justify-between">
        <h1 className="text-3xl"></h1>
        <AddressLink className="my-2 block">{booking.place.destination}</AddressLink>
        <div>
          <h2 className="text-2xl mb-4">Your booking information</h2>
          <h2>
            <span style={{ color: '#00008B' }}>Pick-up location:</span> {booking.place.from}
          </h2>
          <h2>
            <span style={{ color: '#00008B' }}>Car description:</span> {booking.place.color}, {booking.place.brand}, {booking.place.type}, {booking.place.seats} seats
          </h2>
          <h2>
            <span style={{ color: '#00008B' }}>Departing date:</span> {formatDate(booking.place.date)}
          </h2>
          <h2>
            <span style={{ color: '#00008B' }}>Driver Phone No:</span> 0{booking.owner_number}
          </h2>
          <h2>
            <span style={{ color: '#00008B' }}>Reference number:</span> {booking.reference}
          </h2>
        </div>
        <div className="bg-primary text-white rounded-2xl">
          <div>Total price</div>
          <div className="text-3xl">R{booking.price}</div>
        </div>
      </div>
    </div>
  );
}
