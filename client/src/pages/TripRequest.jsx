import { useEffect, useState } from "react";
import axios from "axios";
import AccountNav from "../AccountNav";
import { Navigate, useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";

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
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [open, setOpen] = useState(false);

  const validateForm = () => {
    if (province && from && province2 && destination && date && NumOfPassengers && price && owner_number) {
      setFormError(false);
      return true;
    } else {
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
        const { data } = response;
        if (data.success) {
          setMessage(data.message);
          setMessageType('success');
          setRedirect(true);
        } else {
          setMessage(data.message);
          setMessageType('error');
        }
        setOpen(true); // Open the dialog
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setMessage(error.response.data.message);
      } else {
        setMessage("An error occurred while saving the request.");
      }
      setMessageType('error');
      setOpen(true); // Open the dialog
    }
  }

  const handleClose = () => {
    setOpen(false);
    if (messageType === 'success') {
      setRedirect(true);
    }
  };

  if (redirect) {
    return <Navigate to={'/account/Myrequests'} />
  }

  function renderProvinceOptions() {
    return provinces.map((province, index) => (
      <option key={index} value={province}>
        {province}
      </option>
    ));
  }

  return (
    <section className="px-8 py-20 container mx-auto ">
      <div className="grid bg-white rounded-lg shadow-xl w-full md:w-12/12 lg:w-3/4 mx-auto p-6">
        <div className="flex justify-center mb-4">
          <h1 className="text-gray-600 font-bold text-2xl">Create or Update Trip</h1>
        </div>
        <form onSubmit={saveRequest}>
          {formError && <p className="text-red-500">Please fill out all the required information!</p>}

          <div className="mt-4">
          {preInput('From*', 'Please indicate your preferred pick-up location for passengers.')}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-1">
                <select
                  className="py-2 px-3 rounded-lg border-2 border-purple-300 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  value={province}
                  onChange={(ev) => setProvince(ev.target.value)}
                >
                  <option value="">Select Province</option>
                  {renderProvinceOptions()}
                </select>
              </div>

              <div className="col-span-1">
                <input
                  className="py-2 px-3 rounded-lg border-2 border-purple-300 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  type="text"
                  value={from}
                  onChange={(ev) => setFrom(ev.target.value)}
                  placeholder="City, Township, or specific address"
                />
              </div>
            </div>
          </div>

          <div className="mt-4">
          {preInput('Destination*', 'Indicate the destination of your trip.')}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-1">
                <select
                  className="py-2 px-3 rounded-lg border-2 border-purple-300 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  value={province2}
                  onChange={(ev) => setProvince2(ev.target.value)}
                >
                  <option value="">Select Province</option>
                  {renderProvinceOptions()}
                </select>
              </div>

              <div className="col-span-1">
                <input
                  className="py-2 px-3 rounded-lg border-2 border-purple-300 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  type="text"
                  value={destination}
                  onChange={(ev) => setDestination(ev.target.value)}
                  placeholder="City, Township, or specific address"
                />
              </div>
            </div>
          </div>

          <div className="mt-4">
          {preInput('Additional Information', 'Any other details you would like to share?')}
            <input
              className="py-2 px-3 rounded-lg border-2 border-purple-300 mt-1 w-full"
              type="text"
              value={extraInfo}
              onChange={(ev) => setExtraInfo(ev.target.value)}
              placeholder="Any other relevant details"
            />
          </div>

          <div className="mt-4">
            {preInput('Max Guests*', 'How many passengers can be accommodated?')}
            <input
              className="py-2 px-3 rounded-lg border-2 border-purple-300 mt-1 w-full"
              type="number"
              value={NumOfPassengers}
              onChange={(ev) => setPassengers(ev.target.value)}
              placeholder="Max number of passengers"
            />
          </div>

          <div className="mt-4">
            {preInput('Price*', 'Set the price for the trip.')}
            <input
              className="py-2 px-3 rounded-lg border-2 border-purple-300 mt-1 w-full"
              type="number"
              value={price}
              onChange={(ev) => setPrice(ev.target.value)}
              placeholder="Price in ZAR"
            />
          </div>

          <div className="mt-4">
  {preInput('Phone Number*', 'Please provide your contact number.')}
  <input
    className="py-2 px-3 rounded-lg border-2 border-purple-300 mt-1 w-full"
    type="text"
    value={
      owner_number !== null && owner_number !== undefined
        ? owner_number.toString().startsWith('0')
          ? owner_number
          : `0${owner_number}`
        : '' // Default to an empty string if owner_number is null/undefined
    }
    onChange={(ev) => {
      const inputValue = ev.target.value;
      // Ensure only valid numbers are entered
      const formattedValue = inputValue.replace(/[^0-9]/g, '');
      // Convert back to a number while maintaining "0" at the start
      setPhone(
        formattedValue.startsWith('0')
          ? parseInt(formattedValue, 10)
          : parseInt(`0${formattedValue}`, 10)
      );
    }}
    placeholder="Contact number"
  />
</div>

          <div className="mt-4">
            {preInput('Trip Date*', 'When would you like the trip to occur?')}
            <DatePicker
              selected={date}
              onChange={(date) => setDate(date)}
              minDate={new Date()}
              className="py-2 px-3 rounded-lg border-2 border-purple-300 w-full mt-1"
              dateFormat="dd/MM/yyyy"
            />
          </div>

          <div className="mt-6 flex justify-between items-center">
          <button
  type="submit"
  class="bg-purple-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400">
  Save
</button>

          </div>
        </form>
      </div>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{messageType === 'success' ? "Request Created" : "Error"}</DialogTitle>
        <DialogContent>
          <p>{message}</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Okay</Button>
        </DialogActions>
      </Dialog>
    </section>
  );
}
