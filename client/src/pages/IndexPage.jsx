import {useEffect, useState} from "react";
import axios from "axios";
import {Link} from "react-router-dom";

export default function IndexPage() {
  const [places,setPlaces] = useState([]);
  useEffect(() => {
    axios.get('/places').then(response => {
      setPlaces(response.data);
    });
  }, []);
  return (
    <div className="mt-20">
      {places.length > 0 && places.map(place => (
        <Link to={'/place/'+place._id} className="flex cursor-pointer gap-4 bg-gray-100 p-4 rounded-2xl"
         style={{ marginBottom: '16px' }}>
          <h2 className="font-bold">{place.address}</h2>
          <h3 className="text-sm text-gray-500">{place.title}</h3>
          <div className="mt-1">
            <span className="font-bold">${place.price}</span> per night
          </div>
        </Link>
      ))}
    </div>
  );
}
