import { Link, useParams } from "react-router-dom";
import AccountNav from "../AccountNav";
import { useEffect, useState } from "react";
import axios from "axios";

export default function PlacesPage() {

  const [places, setPlaces] = useState([]);
  useEffect(() => {
    axios.get('/user-places', { withCredentials: true }).then(({ data }) => {
      setPlaces(data);
    });
  }, []);

  return (
    <div>
      <div className="hidden md:block">
      <AccountNav />
      </div>
      <div className="text-center">
        <Link className="inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full" to={'/account/places/new'}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
          </svg>
          Add trip offer
        </Link>
      </div>
      <div className="mt-4">
        {places.length > 0 && places.map(place => (
          <Link to={''} className="flex cursor-pointer gap-4 bg-gray-300 p-4 rounded-2xl" style={{ marginBottom: '16px' }} >
            <div className="grow-0 shrink" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <h2 className="text-xl" style={{ color: 'orange', marginRight: '8px' }}>pick-up area: </h2><span>{place.province}, {place.from}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <h2 className="text-xl" style={{ color: 'orange', marginRight: '8px' }}>destination: </h2><span>{place.province2}, {place.destination}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <h2 style={{ color: 'orange', marginRight: '8px' }}>price: </h2><span>{place.price} per person</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
              <p className="text-sm mt-2" style={{ color: 'orange', marginRight: '8px' }}>date: </p>
<span>{new Date(place.date).toLocaleDateString('en-US')}</span>

              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
