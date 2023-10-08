import {useContext, useEffect, useState} from "react";
import axios from "axios";
import {Navigate} from "react-router-dom";
import {UserContext} from "./UserContext.jsx";

export default function BookingWidget({place}) {
  const [passengers,setPassengers] = useState(1);
  const [name,setName] = useState('');
  const [phone,setPhone] = useState('');
  const [redirect,setRedirect] = useState('');
  const {user} = useContext(UserContext);

  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, [user]);

  async function bookThisPlace() {
    const response = await axios.post('/bookings', {
      passengers,name,phone,
      place:place._id,
      price:passengers * place.price,
    });
    const bookingId = response.data._id;
    setRedirect(`/account/bookings/${bookingId}`);
  }

  if (redirect) {
    return <Navigate to={redirect} />
  }

  return (
    <div className="bg-white shadow p-4 rounded-2xl">
      <div className="text-2xl text-center">
        Price: R{place.price}
      </div>
      <div className="border rounded-2xl mt-4">
        <div className="py-3 px-4 border-t">
          <label>Number of passengers:</label>
          <input type="number"
                 value={passengers}
                 onChange={ev => setPassengers(ev.target.value)}/>
        </div>
        {passengers > 0 && (
          <div className="py-3 px-4 border-t">
            <label>Your full name:</label>
            <input type="text"
                   value={name}
                   onChange={ev => setName(ev.target.value)}/>
            <label>Phone number:</label>
            <input type="tel"
                   value={phone}
                   onChange={ev => setPhone(ev.target.value)}/>
          </div>
        )}
      </div>
      <button onClick={bookThisPlace} className="primary mt-4">
        Book this place
        {passengers > 0 && (
          <span> R{passengers * place.price}</span>
        )}
      </button>
    </div>
  );
}