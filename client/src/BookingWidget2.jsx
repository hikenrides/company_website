import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { UserContext } from "./UserContext";

export default function BookingWidget2({ request }) {
  const [passengers, setPassengers] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [redirect, setRedirect] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, [user]);

  const validatePassengers = () => {
    if (passengers < 1 || passengers > request.maxGuests) {
      setErrorMessage(
        `Please enter a valid number of passengers (1-${request.maxGuests}).`
      );
      return false;
    }
    setErrorMessage("");
    return true;
  };

  const validateDriver = () => {
    if (!user.isDriver) {
      setErrorMessage("Only drivers can accept requests.");
      return false;
    }
    setErrorMessage("");
    return true;
  };

  function generateReference() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 7; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  async function bookThisPlace() {
    try {
      if (!validatePassengers() || !validateDriver()) {
        return;
      }
      const reference = generateReference();

      const response = await axios.post(
        "/bookings2",
        {
          passengers,
          name,
          phone,
          request: request._id,
          price: passengers * request.price,
          reference
        },
        { withCredentials: true }
      );
      const bookingId = response.data._id;
      setRedirect(`/account/bookings../${bookingId}`);
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  }

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <div className="bg-white shadow p-4 rounded-2xl">
      <div className="text-2xl text-center">
        Price: {passengers > 0 && <span> R{passengers * request.price}</span>}
      </div>
      {errorMessage && (
        <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
      )}
      <div className="border rounded-2xl mt-4">
        <div className="py-3 px-4 border-t">
          <label>Number of passengers:</label>
          <input
            type="number"
            value={passengers}
            onChange={(ev) => setPassengers(ev.target.value)}
            max={request.maxGuests}
          />
          {errorMessage && (
            <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
          )}
        </div>
        {passengers > 0 && (
          <div className="py-3 px-4 border-t">
            <label>Your full name:</label>
            <input
              type="text"
              value={name}
              onChange={(ev) => setName(ev.target.value)}
            />
            <label>Phone number:</label>
            <input
              type="tel"
              value={phone}
              onChange={(ev) => setPhone(ev.target.value)}
            />
          </div>
        )}
      </div>
      <button onClick={bookThisPlace} className="primary mt-4">
        Accept Request
      </button>
    </div>
  );
}
