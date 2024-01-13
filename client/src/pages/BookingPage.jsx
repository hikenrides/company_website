import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import AddressLink from "../AddressLink";


export default function BookingPage() {
  const {id} = useParams();
  const [booking,setBooking] = useState(null);
  useEffect(() => {
    if (id) {
      axios.get('/bookings', { withCredentials: true }).then(response => {
        const foundBooking = response.data.find(({_id}) => _id === id);
        if (foundBooking) {
          setBooking(foundBooking);
        }
      });
    }
  }, [id]);

  if (!booking) {
    return 'Loading...';
  }

  return (
    <div className="my-8">
      <div className="bg-gray-300 p-6 my-6 rounded-2xl justify-between">
      <h1 className="text-3xl">{booking.place.title}</h1>
      <AddressLink className="my-2 block">{booking.place.destination}</AddressLink>
        <div>
          <h2 className="text-2xl mb-4">Your booking information</h2>
          <h2>
            <span style={{ color: '#00008B' }}>pick-up location:</span> {booking.place.from}
          </h2>
          <h2>
            <span style={{ color: '#00008B' }}>Car-description: </span>{booking.place.color}, {booking.place.brand}, {booking.place.type}, {booking.place.seats} seats
          </h2>
          <h2>
            <span style={{ color: '#00008B' }}>departing-date: </span> {booking.place.date}
          </h2>
          <h2>
            <span style={{ color: '#00008B' }}>time: </span> 
          </h2>
          <h2>
            <span style={{ color: '#00008B' }}>Reference number: </span> {booking.reference}
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