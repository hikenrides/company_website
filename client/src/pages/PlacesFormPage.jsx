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

export default function PlacesFormPage() {
  const { id } = useParams();
  const [province, setProvince] = useState('');
  const [from, setFrom] = useState('');
  const [province2, setProvince2] = useState('');
  const [destination, setDestination] = useState('');
  const [color, setColor] = useState('white');
  const [brand, setBrand] = useState('toyota');
  const [type, setType] = useState('hatchback');
  const [seats, setSeats] = useState('4');
  const [extraInfo, setExtraInfo] = useState('');
  const [date, setDate] = useState(null);
  const [maxGuests, setMaxGuests] = useState(1);
  const [price, setPrice] = useState(100);
  const [owner_number, setPhone] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [formError, setFormError] = useState(false);

  const validateForm = () => {
    if (province && from && province2 && destination && color && brand && type && seats && date && maxGuests && price && owner_number) {
      setFormError(false);
      return true;
    } else {
      console.log({
        province, from, province2, destination, color, brand, type, seats, date, maxGuests, price, owner_number
      });
      setFormError(true);
      return false;
    }
  };

  useEffect(() => {
    if (!id) {
      axios.get('/profile', { withCredentials: true }).then(response => {
        const { data } = response;
        setPhone(data.phone_number);
      });
      return;
    }
    axios.get('/places/' + id, { withCredentials: true }).then(response => {
      const { data } = response;
      setProvince(data.province);
      setFrom(data.from);
      setProvince2(data.province2);
      setDestination(data.address);
      setColor(data.color);
      setBrand(data.brand);
      setType(data.type);
      setSeats(data.seats);
      setExtraInfo(data.extraInfo);
      setDate(new Date(data.date));
      setMaxGuests(data.maxGuests);
      setPrice(data.price);
      setPhone(data.phone_number);
    });
  }, [id]);

  async function savePlace(ev) {
    ev.preventDefault();
    if (!validateForm()) {
      return;
    }
    const placeData = {
      province, from, province2, destination,
      color, brand, type, seats, extraInfo, owner_number,
      date, maxGuests, price,
    };
    try {
      if (id) {
        // update
        await axios.put('/places', {
          id, ...placeData
        }, { withCredentials: true });
      } else {
        // new place
        await axios.post('/places', placeData, { withCredentials: true });
      }
      setRedirect(true);
    } catch (error) {
      console.log("Failed to save place:", error);
    }
  }

  if (redirect) {
    return <Navigate to={'/account/Mytrips'} />
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
      <form onSubmit={savePlace}>
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

        {preInput('Destination', 'indicate the destination of your trip')}
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

        {preInput('Vehicle Information', 'Please provide the details of your vehicle')}

        <input
          className="bg-gray-300"
          type="text"
          value={color}
          onChange={(ev) => setColor(ev.target.value)}
          placeholder="Color"
        />
        <select
          className="bg-gray-300"
          value={brand}
          onChange={(ev) => setBrand(ev.target.value)}
        >
          <option value="toyota">Toyota</option>
          <option value="ford">Ford</option>
          <option value="volkswagen">Volkswagen</option>
          {/* Add more options as needed */}
        </select>
        <select
          className="bg-gray-300"
          value={type}
          onChange={(ev) => setType(ev.target.value)}
        >
          <option value="hatchback">Hatchback</option>
          <option value="sedan">Sedan</option>
          <option value="suv">SUV</option>
          {/* Add more options as needed */}
        </select>
        <input
          className="bg-gray-300"
          type="number"
          value={seats}
          onChange={(ev) => setSeats(ev.target.value)}
          placeholder="Seats"
        />

        {preInput('Extra Information', 'Additional information you want to provide')}
        <textarea
          className="bg-gray-300"
          value={extraInfo}
          onChange={(ev) => setExtraInfo(ev.target.value)}
        />

        {preInput('Trip Date', 'Please select the date of the trip')}
        <DatePicker
          selected={date}
          onChange={(date) => setDate(date)}
          className="bg-gray-300"
        />

        {preInput('Max Guests', 'Please provide the maximum number of guests')}
        <input
          className="bg-gray-300"
          type="number"
          value={maxGuests}
          onChange={(ev) => setMaxGuests(ev.target.value)}
        />

        {preInput('Price per Trip', 'Please provide the price per trip')}
        <input
          className="bg-gray-300"
          type="number"
          value={price}
          onChange={(ev) => setPrice(ev.target.value)}
        />

        {preInput('Phone Number', 'Please provide your phone number')}
        <input
          className="bg-gray-300"
          type="text"
          value={owner_number}
          onChange={(ev) => setPhone(ev.target.value)}
        />

        <button className="primary my-4">Save</button>
        {formError && (
          <div className="text-red-500">
            Please fill in all the required fields.
          </div>
        )}
      </form>
    </div>
  );
}

function preInput(header, description) {
  return (
    <div>
      <h2 className="text-2xl mt-4">{header}</h2>
      <p className="text-gray-500 text-sm">{description}</p>
    </div>
  );
}
