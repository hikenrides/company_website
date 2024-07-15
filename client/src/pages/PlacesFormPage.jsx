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
  const [frequency, setFrequency] = useState('Regular');

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
    axios.get('/places/' + id, config).then(response => {
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
      setFrequency(data.frequency);
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

  async function savePlace(ev) {
    ev.preventDefault();
    if (!validateForm()) {
      return;
    }
    const placeData = {
      province, from, province2, destination,
      color, brand, type, seats, extraInfo, owner_number,
      date, maxGuests, price, frequency, // Add frequency to place data
    };
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    try {
      if (id) {
        // update
        await axios.put('/places', {
          id, ...placeData
        }, config);
      } else {
        // new place
        await axios.post('/places', placeData, config);
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
        <div className="vehicle-description">
          {preInput('Vehicle description', 'description of the vehicle')}
          <div className="horizontal-selects">
            <div className="select-container">
              <label htmlFor="colorSelect" className="text-white mt-2 -mb-1">
                Color:
              </label>
              <select id="colorSelect" className="bg-gray-300" value={color} onChange={(ev) => setColor(ev.target.value)}>
                <option value="white">White</option>
                <option value="black">Black</option>
                <option value="silver">Silver</option>
                <option value="gray">Gray</option>
                <option value="red">Red</option>
                <option value="blue">Blue</option>
                <option value="green">Green</option>
                <option value="yellow">Yellow</option>
                <option value="orange">Orange</option>
                <option value="brown">Brown</option>
                <option value="purple">Purple</option>
                <option value="pink">Pink</option>
                <option value="gold">Gold</option>
                <option value="bronze">Bronze</option>
                <option value="beige">Beige</option>
                <option value="burgundy">Burgundy</option>
                <option value="turquoise">Turquoise</option>
                <option value="lavender">Lavender</option>
                <option value="teal">Teal</option>
              </select>
            </div>
            <div className="select-container">
              <label htmlFor="brandSelect" className="text-white mt-2 -mb-1">
                Brand:
              </label>
              <select id="brandSelect" className="bg-gray-300" value={brand} onChange={(ev) => setBrand(ev.target.value)}>
                <option value="toyota">Toyota</option>
                <option value="honda">Honda</option>
                <option value="ford">Ford</option>
                <option value="renault">Renault</option>
                <option value="haval">Haval</option>
                <option value="bmw">BMW</option>
                <option value="alfa romeo">ALFA Romeo</option>
                <option value="gwm">GWM</option>
                <option value="baic">BAIC</option>
                <option value="volkswagen">Volkswagen</option>
                <option value="cadillac">Cadillac</option>
                <option value="peugeot">Peugeot</option>
                <option value="seat">SEAT</option>
                <option value="mercedes-benz">Mercedes-Benz</option>
                <option value="nissan">Nissan</option>
                <option value="hyundai">Hyundai</option>
                <option value="kia">Kia</option>
                <option value="suzuki">Suzuki</option>
                <option value="audi">Audi</option>
                <option value="fiat">Fiat</option>
                <option value="aston martin">Aston Martin</option>
                <option value="opel">Opel</option>
                <option value="porsche">Porsche</option>
                {/* Add more brand options here */}
              </select>
            </div>
            <div className="select-container">
              <label htmlFor="typeSelect" className="text-white mt-2 -mb-1">
                Type:
              </label>
              <select id="typeSelect" className="bg-gray-300" value={type} onChange={(ev) => setType(ev.target.value)}>
                <option value="hatchback">Hatchback</option>
                <option value="sedan">Sedan</option>
                <option value="suv">SUV</option>
                <option value="coupe">Coupe</option>
                <option value="convertible">Convertible</option>
                <option value="pickup">Pickup</option>
                <option value="van">Van</option>
                <option value="minivan">Minivan</option>
                <option value="wagon">Wagon</option>
                <option value="crossover">Crossover</option>
                <option value="luxury">Luxury</option>
                <option value="electric">Electric</option>
                <option value="sports">Sports Car</option>
                <option value="diesel">Diesel</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
            <div className="select-container">
              <label htmlFor="seatsSelect" className="text-white mt-2 -mb-1">
                Seats:
              </label>
              <select id="seatsSelect" className="bg-gray-300" value={seats} onChange={(ev) => setSeats(ev.target.value)}>
                <option value="2">2</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
                <option value="11">11</option>
                <option value="12">12</option>
              </select>
            </div>
          </div>
        </div>

        {preInput('Date', 'indicate the date')}
        <div>
            <DatePicker
              className="bg-gray-300"
              selected={date}
              onChange={(date) => setDate(date)}
              placeholderText="Select leaving date"
              dateFormat="MM/dd/yyyy"
              popperPlacement="top-start"
              minDate={new Date()}
            />
          </div>

        {preInput('Max number of passengers', 'Indicate the maximum number of passengers you are willing to accommodate in your vehicle')}
        <input
          className="bg-gray-300"
          type="number"
          value={maxGuests}
          onChange={(ev) => setMaxGuests(ev.target.value)}
          placeholder="Max number of passengers"
        />

        {preInput('Price per passenger', 'indicate the price you charge per passenger')}
        <input
          className="bg-gray-300"
          type="number"
          value={price}
          onChange={(ev) => setPrice(ev.target.value)}
          placeholder="Price per passenger"
        />

        {preInput('Trip Frequency', 'Indicate how frequently this trip will occur')}
        <div className="flex flex-col md:flex-row gap-2 mt-2">
          <label className="text-white">
            <input
              type="radio"
              value="Regular"
              checked={frequency === 'Regular'}
              onChange={(ev) => setFrequency(ev.target.value)}
              className="mr-1"
            />
            Regular
          </label>
          <label className="text-white">
            <input
              type="radio"
              value="Once-off"
              checked={frequency === 'Once-off'}
              onChange={(ev) => setFrequency(ev.target.value)}
              className="mr-1"
            />
            Once-off
          </label>
          <label className="text-white">
            <input
              type="radio"
              value="Daily"
              checked={frequency === 'Daily'}
              onChange={(ev) => setFrequency(ev.target.value)}
              className="mr-1"
            />
            Daily
          </label>
          <label className="text-white">
            <input
              type="radio"
              value="Weekly"
              checked={frequency === 'Weekly'}
              onChange={(ev) => setFrequency(ev.target.value)}
              className="mr-1"
            />
            Weekly
          </label>
        </div>

        {preInput('Description', 'Add any additional information about the trip')}
        <textarea
          className="bg-gray-300"
          value={extraInfo}
          onChange={(ev) => setExtraInfo(ev.target.value)}
        />

        <button className="primary my-4">Save</button>
        {formError && <p className="text-red-500">Please fill in all fields before saving.</p>}
      </form>
    </div>
  );
}
