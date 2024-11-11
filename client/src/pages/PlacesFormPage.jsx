import { useEffect, useState } from "react";
import axios from "axios";
import AccountNav from "../AccountNav";
import { Navigate, useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { 
  Input,
  Typography,
  Select,
  Option
} from "@material-tailwind/react";
import { format } from "date-fns";

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
      <h2 className="text-gray-600 text-lg">{text}</h2>
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
      date, maxGuests, price, frequency,
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
    <section className="px-8 py-20 container mx-auto">
      <div className="grid bg-white rounded-lg shadow-xl w-full md:w-12/12 lg:w-3/4 mx-auto p-6">
        <div className="flex justify-center py-4">
        </div>
        <div className="flex justify-center mb-4">
          <h1 className="text-gray-600 font-bold text-2xl">Create or Update Trip</h1>
        </div>
        <form onSubmit={savePlace}>
        <div className="mt-4">
            {preInput('From', 'Please indicate your preferred pick-up location for passengers.')}
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
            {preInput('Destination', 'Indicate the destination of your trip.')}
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
            {preInput('Vehicle Description', 'Provide a description of the vehicle.')}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="col-span-1">
                <label htmlFor="colorSelect">Color:</label>
                <select
                  id="colorSelect"
                  className="py-2 px-3 rounded-lg border-2 border-purple-300 mt-1"
                  value={color}
                  onChange={(ev) => setColor(ev.target.value)}
                >
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

              <div className="col-span-1">
                <label htmlFor="brandSelect">Brand:</label>
                <select
                  id="brandSelect"
                  className="py-2 px-3 rounded-lg border-2 border-purple-300 mt-1"
                  value={brand}
                  onChange={(ev) => setBrand(ev.target.value)}
                >
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
                </select>
              </div>

              <div className="col-span-1">
                <label htmlFor="typeSelect">Type:</label>
                <select
                  id="typeSelect"
                  className="py-2 px-3 rounded-lg border-2 border-purple-300 mt-1"
                  value={type}
                  onChange={(ev) => setType(ev.target.value)}
                >
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
            {preInput('Max Guests', 'How many passengers can be accommodated?')}
            <input
              className="py-2 px-3 rounded-lg border-2 border-purple-300 mt-1 w-full"
              type="number"
              value={maxGuests}
              onChange={(ev) => setMaxGuests(ev.target.value)}
              placeholder="Max number of passengers"
            />
          </div>

          <div className="mt-4">
            {preInput('Price', 'Set the price for the trip.')}
            <input
              className="py-2 px-3 rounded-lg border-2 border-purple-300 mt-1 w-full"
              type="number"
              value={price}
              onChange={(ev) => setPrice(ev.target.value)}
              placeholder="Price in ZAR"
            />
          </div>

          <div className="mt-4">
            {preInput('Phone Number', 'Please provide your contact number.')}
            <input
              className="py-2 px-3 rounded-lg border-2 border-purple-300 mt-1 w-full"
              type="text"
              value={owner_number}
              onChange={(ev) => setPhone(ev.target.value)}
              placeholder="Contact number"
            />
          </div>

          <div className="mt-4">
            {preInput('Trip Date', 'When would you like the trip to occur?')}
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
              className="bg-purple-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              Save Trip
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
