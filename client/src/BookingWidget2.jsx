import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";

export default function BookingWidget2({ request }) {
  const [passengers, setPassengers] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [redirect, setRedirect] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [open, setOpen] = useState(false); // For controlling the modal
  const [bookingStatus, setBookingStatus] = useState(null); // For tracking the booking status
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (user) {
      setName(user.name);
      checkExistingBooking();
    }
  }, [user]);

  const validatePassengers = () => {
    if (passengers < 1 || passengers > request.maxGuests) {
      setErrorMessage(`Please enter a valid number of passengers (1-${request.maxGuests}).`);
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

  const checkExistingBooking = async () => {
    try {
      const response = await axios.get(`/bookings2?request=${request._id}`, { withCredentials: true });
      if (response.data.length > 0) {
        setBookingStatus(response.data[0]);
      }
    } catch (error) {
      console.error("Error checking existing booking:", error);
    }
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
      setOpen(true); // Show the modal on success
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  }

  async function cancelBooking() {
    try {
      const response = await axios.put(
        `/bookings2/cancel/${bookingStatus._id}`,
        { status: "driver cancelled" },
        { withCredentials: true }
      );
      setBookingStatus(null);
      setOpen(true); // Show the modal on success
    } catch (error) {
      console.error("Error cancelling booking:", error);
    }
  }

  const handleClose = () => {
    setOpen(false);
    setRedirect("/account/requests");
  };

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <div className="bg-white shadow p-4 rounded-2xl">
      <div className="text-2xl text-center">
        Price: {passengers > 0 && <span> R{passengers * request.price}</span>}
      </div>
      {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}
      <div className="border rounded-2xl mt-4">
        <div className="py-3 px-4 border-t">
          <label>Number of passengers:</label>
          <input
            type="number"
            value={passengers}
            onChange={(ev) => setPassengers(ev.target.value)}
            max={request.maxGuests}
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
      {bookingStatus ? (
        <div>
          <p className="text-green-500 text-sm mt-2">You've already accepted the trip request.</p>
          <button onClick={cancelBooking} className="primary mt-4">
            Cancel Acceptance
          </button>
        </div>
      ) : (
        <button onClick={bookThisPlace} className="primary mt-4">
          Accept Request
        </button>
      )}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Request {bookingStatus ? "Cancelled" : "Accepted"}</DialogTitle>
        <DialogContent>
          <p>We've notified the passenger and we'll communicate with you if there's any changes.</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Okay</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
