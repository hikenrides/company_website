import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { UserContext } from "./UserContext";

export default function BookingWidget({ place }) {
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
    if (passengers < 1 || passengers > place.maxGuests) {
      setErrorMessage(
        `Please enter a valid number of passengers (1-${place.maxGuests}).`
      );
      return false;
    }
    setErrorMessage("");
    return true;
  };

  const validateBalance = () => {
    const totalCost = passengers * place.price;
    if (user.balance < totalCost) {
      setErrorMessage("Insufficient funds. Please add funds to your account.");
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
      if (!validatePassengers() || !validateBalance()) {
        return;
      }
      const reference = generateReference();

      const response = await axios.post(
        "/bookings",
        {
          passengers,
          name,
          phone,
          place: place._id,
          price: passengers * place.price,
          reference
        },
        { withCredentials: true }
      );

      const bookingId = response.data._id;

      const updatedBalance = user.balance - (passengers * place.price);
      await axios.put('/users/update-balance', {
        id: user._id,
        balance: updatedBalance
        }, { withCredentials: true });


      // Send a message to the person who posted the offer
      await axios.post("/messages", {
        sender: user._id, // Assuming user is the person making the booking
        receiver: place.owner, // Assuming place.user is the person who posted the offer
        content: `Booking request for place ${place._id}. Booking ID: ${bookingId}`,
      });

      setRedirect(`/account/bookings/${bookingId}`);
    } catch (error) {
      console.error("Error making a booking:", error);
    }
  }

  

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <div className="bg-white shadow p-4 rounded-2xl">
      <div className="text-2xl text-center">
        Price: {passengers > 0 && <span> R{passengers * place.price}</span>}
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
          />
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
        Request Ride
      </button>
    </div>
  );
}
