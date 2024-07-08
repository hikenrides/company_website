import { useEffect, useState } from "react";
import axios from "axios";
import AccountNav from "../AccountNav";
import { Navigate, useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import "react-datepicker/dist/react-datepicker.css";

const provinces = [
  "Eastern Cape",
  "Free State",
  "Gauteng",
  "KwaZulu-Natal",
  "Limpopo",
  "Mpumalanga",
  "North West",
  "Northern Cape",
  "Western Cape",
];

export default function TripRequest() {
  const { id } = useParams();
  const [province, setProvince] = useState('');
  const [from, setFrom] = useState('');
  const [province2, setProvince2] = useState('');
  const [destination, setDestination] = useState('');
  const [extraInfo, setExtraInfo] = useState('');
  const [owner_number, setPhone] = useState('');
  const [date, setDate] = useState(null);
  const [NumOfPassengers, setPassengers] = useState(1);
  const [price, setPrice] = useState(100);
  const [redirect, setRedirect] = useState(false);
  const [formError, setFormError] = useState(false);
  const [open, setOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  const validateForm = () => {
    if (province && from && province2 && destination && date && NumOfPassengers && price && owner_number) {
      setFormError(false);
      return true;
    } else {
      console.log({
        province, from, province2, destination, date, NumOfPassengers, price, owner_number
      });
      setFormError(true);
      return false;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    if (!id) {
      axios.get('/profile', config).then(response => {
        const { data } = response;
        setPhone(data.phone_number);
      });
      return;
    }
    axios.get('/requests/' + id, config).then(response => {
      const { data } = response;
      setProvince(data.province);
      setFrom(data.from);
      setProvince2(data.province2);
      setDestination(data.address);
      setExtraInfo(data.extraInfo);
      setDate(new Date(data.date));
      setPassengers(data.NumOfPassengers);
      setPrice(data.price);
      setPhone(data.phone_number);
    });
  }, [id]);

  function inputHeader(text) {
    return (
      <h2 className="text-white text-2xl mt-4">{text}</h2>
    );
  }

  function inputDescription(text) {
    return (
      <p className="text-gray-500 text-sm">{text}</p>
    );
  }

  function preInput(header, description) {
    return (
      <>
        {inputHeader(header)}
        {inputDescription(description)}
      </>
    );
  }

  async function saveRequest(ev) {
  ev.preventDefault();
  if (!validateForm()) {
    return;
  }
  const RequestData = {
    province,
    from,
    province2,
    destination,
    extraInfo,
    owner_number,
    date,
    NumOfPassengers,
    price,
  };
  const token = localStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  try {
    if (id) {
      await axios.put(`/requests/${id}`, RequestData, config);
    } else {
      const response = await axios.post('/requests', RequestData, config);
      if (response.data.success) {
        setDialogMessage("Your trip request has been successfully created and the cost of the trip has been deducted from your account. NB: cash is refundable if you cancel the request or if a driver is not found by the time when the trip is supposed to take place.");
        setOpen(true);
        setRedirect(true);
      }
    }
  } catch (error) {
    if (error.response && error.response.status === 400) {
      setDialogMessage("Insufficient funds, please deposit money to your account for you to be able to request trips.");
      setOpen(true);
    } else {
      console.log("Failed to save request:", error);
    }
  }
}

const handleClose = () => {
  setOpen(false);
  if (dialogMessage.includes("successfully created")) {
    setRedirect(true); // Set redirect to true after successfully creating a request
  }
};

if (redirect) {
  return <Navigate to={'/account/Myrequests'} />
};

  function renderProvinceOptions() {
    return provinces.map((province, index) => (
      <option key={index} value={province}>
        {province}
      </option>
    ));
  }

  return (
    <div>
      <div className="hidden md:block">
        <AccountNav />
      </div>
      <form onSubmit={saveRequest}>
        {formError && (
          <p style={{ color: 'red' }}>Please fill out all the required information!</p>
        )}
        {preInput('From', 'Please indicate your preferred pick-up location for passengers.')}
        <select
          className="bg-gray-300"
          value={province}
          onChange={(ev) => setProvince(ev.target.value)}
        >
          <option value="">Select Province</option>
          {renderProvinceOptions()}
        </select>
        <input
          className="bg-gray-300"
          type="text"
          value={from}
          onChange={(ev) => setFrom(ev.target.value)}
          placeholder="City, Township, or specific address"
        />
  
        {preInput('Destination', 'Indicate the destination of your trip')}
        <select
          className="bg-gray-300"
          value={province2}
          onChange={(ev) => setProvince2(ev.target.value)}
        >
          <option value="">Select Province</option>
          {renderProvinceOptions()}
        </select>
        <input
          className="bg-gray-300"
          type="text"
          value={destination}
          onChange={(ev) => setDestination(ev.target.value)}
          placeholder="City, Township, or specific address"
        />
  
        {preInput('Extra info (optional)', 'Trip rules, etc')}
        <textarea
          className="bg-gray-300"
          value={extraInfo}
          onChange={(ev) => setExtraInfo(ev.target.value)}
        />
  
        {preInput('Departure', 'Add departing date, number of passengers and price per person')}
        <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <h3 className="text-white mt-2 -mb-1">Date</h3>
            <DatePicker
              className="bg-gray-300"
              selected={date}
              onChange={(date) => setDate(date)}
              placeholderText="Select leaving date"
              dateFormat="MM/dd/yyyy"
              popperPlacement="top-start"
            />
          </div>
  
          <div>
            <h3 className="text-white mt-2 -mb-1">Number of people</h3>
            <input
              className="bg-gray-300"
              type="number"
              value={NumOfPassengers}
              onChange={(ev) => setPassengers(ev.target.value)}
            />
          </div>
  
          <div>
            <h3 className="text-white mt-2 -mb-1">Price per person</h3>
            <input
              className="bg-gray-300"
              type="number"
              value={price}
              onChange={(ev) => setPrice(ev.target.value)}
            />
          </div>
        </div>
  
        <button className="primary my-4">Save</button>
      </form>
  
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Request {dialogMessage.includes("successfully created") ? "Created" : "Error"}</DialogTitle>
        <DialogContent>
          <p>{dialogMessage}</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Okay</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
  
}
