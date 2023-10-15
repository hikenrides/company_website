import {useEffect, useState} from "react";
import axios from "axios";
import {Link} from "react-router-dom";

export default function TripOfferPage() {
  const [places,setPlaces] = useState([]);
  useEffect(() => {
    axios.get('/places').then(response => {
      setPlaces(response.data);
    });
  }, []);
  return (
    <div className="mt-20">
      {places.length > 0 && places.map(place => (
        <Link to={'/place/'+place._id} className="block cursor-pointer gap-4 bg-gray-300 p-4 rounded-2xl"
         style={{ marginBottom: '16px' }}>
          <h2 className="font-bold">From: {place.destination}</h2>
          <h3 className="text-sm text-gray-500">To: {place.from}</h3>
          <div className="mt-1">
            <span className="font-bold">R{place.price}</span> per person
          </div>
        </Link>
      ))}
    </div>
  );
}
