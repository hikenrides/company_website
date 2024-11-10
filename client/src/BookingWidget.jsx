import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";

export default function BookingWidget({ place }) {
  const [passengers, setPassengers] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [redirect, setRedirect] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false); 
  const [isBookingComplete, setIsBookingComplete] = useState(false); 
  const [bookingId, setBookingId] = useState(null); // Store bookingId for redirection
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, [user]);

  const validatePassengers = () => {
    if (passengers < 1 || passengers > place.maxGuests) {
      setErrorMessage(`The driver only wants ${place.maxGuests} passengers.`);
      setDialogOpen(true); 
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
      setBookingId(bookingId); // Store bookingId for redirect
      setIsBookingComplete(true); // Set booking as complete

      const updatedBalance = user.balance - (passengers * place.price);
      await axios.put('/users/update-balance', {
        id: user._id,
        balance: updatedBalance
      }, { withCredentials: true });

    } catch (error) {
      console.error("Error making a booking:", error);
    }
  }

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <div className="relative">
      {/* Overlay and Confirmation Modal */}
      {isBookingComplete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="rounded-lg bg-gray-50 px-16 py-14 shadow-lg">
            <div className="flex justify-center">
              <div className="rounded-full bg-green-200 p-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500 p-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-8 w-8 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
              </div>
            </div>
            <h3 className="my-4 text-center text-3xl font-semibold text-gray-700">Congratulations!</h3>
            <p className="w-[230px] text-center font-normal text-gray-600">Your booking has been confirmed and is being processed.</p>
            <button 
              className="mx-auto mt-10 block rounded-xl border-4 border-transparent bg-orange-400 px-6 py-3 text-center text-base font-medium text-orange-100 hover:outline-8 hover:duration-300"
              onClick={() => setRedirect(`/account/bookings/${bookingId}`)}
            >
              Track Booking
            </button>
          </div>
        </div>
      )}

      {/* Booking Form */}
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

        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
          <DialogTitle>Error</DialogTitle>
          <DialogContent>
            <p>{errorMessage}</p>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)} color="primary">
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}
