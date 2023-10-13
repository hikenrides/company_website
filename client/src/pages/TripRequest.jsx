import {useEffect, useState} from "react";
import axios from "axios";
import AccountNav from "../AccountNav";
import {Navigate, useParams} from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function TripRequest() {
  const {id} = useParams();
  const [from,setFrom] = useState('');
  const [destination,setDestination] = useState('');
  const [extraInfo,setExtraInfo] = useState('');
  const [date,setDate] = useState('');
  const [NumOfPassengers,setPassengers] = useState(1);
  const [price,setPrice] = useState(100);
  const [redirect,setRedirect] = useState(false);
  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get('/requests/'+id).then(response => {
       const {data} = response;
       setFrom(data.from);
       setDestination(data.address);
       setExtraInfo(data.extraInfo);
       setDate(data.date);
       setPassengers(data.NumOfPassengers);
       setPrice(data.price);
    });
  }, [id]);
  function inputHeader(text) {
    return (
      <h2 className="text-2xl mt-4">{text}</h2>
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
    const RequestData = {
      from, destination,
      extraInfo,
      date, NumOfPassengers, price,
    };
    if (id) {
      // update
      await axios.put('/requests', {
        id, ...RequestData
      });
      setRedirect(true);
    } else {
      // new place
      await axios.post('/requests', RequestData);
      setRedirect(true);
    }

  }

  if (redirect) {
    return <Navigate to={'/account/requests'} />
  }

  return (
    <div>
      <AccountNav />
      <form onSubmit={saveRequest}>
        {preInput('From', 'Please indicate your preferred pick-up location for passengers.')}
        <input type="text" value={from} onChange={ev => setFrom(ev.target.value)} placeholder="Province, City, township, or specific address"/>
        {preInput('Destination', 'indicate the destination of your trip')}
        <input type="text" value={destination} onChange={ev => setDestination(ev.target.value)}placeholder="Province, City, Township, or specific address)"/>
        {preInput('Extra info','trip rules, etc')}
        <textarea value={extraInfo} onChange={ev => setExtraInfo(ev.target.value)} />
        {preInput('Check in&out times','add check in and out times, remember to have some time window for cleaning the room between guests')}
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