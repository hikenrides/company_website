import { useEffect, useState } from "react";
import axios from "axios";
import AccountNav from "../AccountNav";
import { Navigate, useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
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
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

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
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setMessage(error.response.data.message);
      } else {
        setMessage("An error occurred while saving the request.");
      }
      setMessageType('error');
    }
  }

  if (redirect) {
    return <Navigate to={'/account/requests'} />
  }

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
        {message && (
          <p style={{ color: messageType === 'error' ? 'red' : 'green' }}>{message}</p>
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

        {preInput('Departure', 'add departing date, number of passengers and price per person')}
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
            <h3 className=" text-white mt-2 -mb-1">Number of people</h3>
            <input
              className="bg-gray-300"
              type="number"
              value={NumOfPassengers}
              onChange={(ev) => setPassengers(ev.target.value)}
            />
          </div>

          <div>
            <h3 className=" text-white mt-2 -mb-1">Price per person</h3>
            <input
              className="bg-gray-300"
              type="number"
              value={price}
              onChange={(ev) => setPrice(ev.target.value)}
            />
          </div>

          <div>
            <h3 className="text-white mt-2 -mb-1">Phone number</h3>
            <input
              className="bg-gray-300"
              type="tel"
              value={owner_number}
              onChange={(ev) => setPhone(ev.target.value)}
              placeholder="e.g. +27123456789"
            />
          </div>
        </div>
        <div className="flex justify-between mt-4">
          <button
            type="button"
            className="py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            onClick={() => setRedirect(true)}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="py-2 px-4 bg-primary text-white rounded-md hover:bg-primary-dark"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
