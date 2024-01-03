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


export default function TripRequest() {
  const {id} = useParams();
  const [province, setProvince] = useState('');
  const [from,setFrom] = useState('');
  const [province2,setProvince2] = useState('');
  const [destination,setDestination] = useState('');
  const [extraInfo,setExtraInfo] = useState('');
  const [date,setDate] = useState('');
  const [NumOfPassengers,setPassengers] = useState(1);
  const [price,setPrice] = useState(100);
  const [redirect,setRedirect] = useState(false);
  const [formError, setFormError] = useState(false);

  const validateForm = () => {
    if (province && from && province2 && destination && date && NumOfPassengers && price) {
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
    axios.get('/requests/'+id, { withCredentials: true }).then(response => {
       const {data} = response;
       setProvince(data.province)
       setFrom(data.from);
       setProvince2(data.province2)
       setDestination(data.address);
       setExtraInfo(data.extraInfo);
       setDate(data.date);
       setPassengers(data.NumOfPassengers);
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
      date,
      NumOfPassengers,
      price,
    };
    if (id) {
      // update
      await axios.put(`/requests/${id}`, RequestData); // Here, specify the correct endpoint for updating a specific request
      setRedirect(true);
    } else {
      await axios.post('/requests', RequestData);
      setRedirect(true);
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
        <input type="text" value={destination} onChange={ev => setDestination(ev.target.value)}placeholder="City, Township, or specific address)"/>
        {preInput('Extra info(optional)','trip rules, etc')}
        <textarea value={extraInfo} onChange={ev => setExtraInfo(ev.target.value)} />
        {preInput('Departure','add departing date, number of passengers and price per person')}
        <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
          <div>
            <h3 className="mt-2 -mb-1">Date</h3>
          <DatePicker
  selected={date}
  onChange={(date) => setDate(date)} 
  placeholderText="Select leaving date" 
  dateFormat="MM/dd/yyyy" 
/>
</div>
          
          <div>
            <h3 className="mt-2 -mb-1">Number of people</h3>
            <input type="number" value={NumOfPassengers}
                   onChange={ev => setPassengers(ev.target.value)}/>
          </div>
          <div>
            <h3 className="mt-2 -mb-1">Price per person</h3>
            <input type="number" value={price}
                   onChange={ev => setPrice(ev.target.value)}/>
          </div>
        </div>
        <button className="primary my-4">Save</button>
      </form>
    </div>
  );
}