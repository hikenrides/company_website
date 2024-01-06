import {useEffect, useState} from "react";
import axios from "axios";
import AccountNav from "../AccountNav";
import {Navigate, useParams} from "react-router-dom";
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
  const {id} = useParams();
  const [province, setProvince] = useState('');
  const [from,setFrom] = useState('');
  const [province2,setProvince2] = useState('');
  const [destination,setDestination] = useState('');
  const [color, setColor] = useState('white');
  const [brand, setBrand] = useState('');
  const [type, setType] = useState('');
  const [seats, setSeats] = useState('4');
  const [extraInfo,setExtraInfo] = useState('');
  const [date,setDate] = useState('');
  const [maxGuests,setMaxGuests] = useState(1);
  const [price,setPrice] = useState(100);
  const [redirect,setRedirect] = useState(false);
  const [formError, setFormError] = useState(false);

  const validateForm = () => {
    if (province && from && province2 && destination && color && brand && type && seats && date && maxGuests && price) {
      setFormError(false);
      return true;
    } else {
      setFormError(true);
      return false;
    }
  };

  
  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get('/places/'+id, { withCredentials: true }).then(response => {
       const {data} = response;
       setProvince(data.province)
       setFrom(data.from);
       setProvince2(data.province2)
       setDestination(data.address);
       setColor(data.color);
       setBrand(data.brand);
       setType(data.type);
       setSeats(data.seats);
       setExtraInfo(data.extraInfo);
       setDate(data.date);
       setMaxGuests(data.maxGuests);
       setPrice(data.price);
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
  function preInput(header,description) {
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
      color,brand,type,seats, extraInfo,
      date, maxGuests, price,
    };
    if (id) {
      // update
      await axios.put('/places', {
        id, ...placeData
      });
      setRedirect(true);
    } else {
      // new place
      await axios.post('/places', placeData);
      setRedirect(true);
    }

  }

  if (redirect) {
    return <Navigate to={'/account/places'} />
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
      <AccountNav />
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
        <input className="bg-gray-300" type="text" value={destination} onChange={ev => setDestination(ev.target.value)}placeholder="City, Township, or specific address)"/>
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
      <select id="brandSelect" className="bg-gray-300" value={brand} onChange={ev => setBrand(ev.target.value)}>
        <option value="toyota">Toyota</option>
        <option value="honda">Honda</option>
        <option value="ford">Ford</option>
        <option value="toyota">Renault</option>
        <option value="honda">Haval</option>
        <option value="ford">BMW</option>
        <option value="toyota">ALFA Romeo</option>
        <option value="honda">GWM</option>
        <option value="ford">BAIC</option>
        <option value="toyota">Volkswagen</option>
        <option value="honda">Cadillac</option>
        <option value="ford">Peugeot</option>
        <option value="toyota">SEAT</option>
        <option value="honda">Mercedes-Benz</option>
        <option value="ford">Nissan</option>
        <option value="toyota">Hyundai</option>
        <option value="honda">Kia</option>
        <option value="ford">Suzuki</option>
        <option value="toyota">Audi</option>
        <option value="honda">Fiat</option>
        <option value="ford">Aston Martin</option>
        <option value="toyota">Opel</option>
        <option value="honda">Porsche</option>
        {/* Add more brand options here */}
      </select>
    </div>
    <div className="select-container">
      <label htmlFor="typeSelect" className="text-white mt-2 -mb-1">
        Type: 
      </label>
      <select id="typeSelect" className="bg-gray-300" value={type} onChange={ev => setType(ev.target.value)}>
        <option value="sedan">Utility vehicle</option>
        <option value="sedan">Hybrid</option>
        <option value="sedan">Family Car</option>
        <option value="sedan">Limousine</option>
        <option value="sedan">Mini MPV</option>
        <option value="sedan">convertible</option>
        <option value="sedan">Truck</option>
        <option value="suv">Hatchback</option>
        <option value="truck">Sedan</option>
        <option value="sedan">Mini-van</option>
        <option value="suv">Van</option>
        <option value="truck">Cross-over</option>
        <option value="sedan">Station Wagon</option>
        <option value="suv">Coupe</option>
        <option value="truck">pickup truck</option>
        <option value="sedan">Sports car</option>
        <option value="suv">SUV</option>
        <option value="truck">Electric vehicle</option>
        <option value="sedan">Compact</option>
        <option value="suv">Roadster</option>
        {/* Add more type options here */}
      </select>
    </div>
    <div className="select-container">
      <label htmlFor="seatsSelect" className="text-white mt-2 -mb-1">
        Number of Seats: 
      </label>
      <select id="seatsSelect" className="bg-gray-300" value={seats} onChange={ev => setSeats(ev.target.value)}>
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
        <option value="13">13</option>
        <option value="14">14</option>
        {/* Add more seat options here */}
      </select>
    </div>
  </div>
</div>


        {preInput('Extra info(optional)','trip rules, etc')}
        <textarea className="bg-gray-300" value={extraInfo} onChange={ev => setExtraInfo(ev.target.value)} />
        {preInput('Departure','add departing date, number of passengers and price per person')}
        <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
          <div>
            <h3 className="text-white mt-2 -mb-1">Date</h3>
          <DatePicker
            className="bg-gray-300"
            selected={date}
            onChange={(date) => setDate(date)} 
            placeholderText="Select leaving date" 
            dateFormat="MM/dd/yyyy" 
          />
          </div>
          
          <div>
            <h3 className="text-white mt-2 -mb-1">Max number of passengers</h3>
            <input className="bg-gray-300" type="number" value={maxGuests}
                   onChange={ev => setMaxGuests(ev.target.value)}/>
          </div>
          <div>
            <h3 className="text-white mt-2 -mb-1">Price per person</h3>
            <input className="bg-gray-300" type="number" value={price}
                   onChange={ev => setPrice(ev.target.value)}/>
          </div>
        </div>
        <button className="primary my-4">Save</button>
        {formError && (
        <p style={{ color: 'red' }}>Please fill out all the required information!</p>
      )}
      </form>
      
    </div>
  );
}