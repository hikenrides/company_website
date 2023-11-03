import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

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

export default function TripOfferPage() {
  const [places, setPlaces] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState('');

  useEffect(() => {
    axios.get('/places').then(response => {
      setPlaces(response.data);
    });
  }, []);

  const handleProvinceSelect = (province) => {
    setSelectedProvince(prevState => prevState === province ? '' : province);
  };

  return (
    <div className="mt-20">
      {provinces.map((province, index) => (
        <div key={index}>
          <h2
            className="cursor-pointer bg-gray-300 p-4 rounded-2xl flex justify-between items-center"
            onClick={() => handleProvinceSelect(province)}
            style={{ marginBottom: '16px' }}
          >
            {province} {selectedProvince === province ? '▲' : '▼'}
          </h2>
          {selectedProvince === province && places.filter(place => place.province === province).map(place => (
            <Link
              key={place._id}
              to={'/place/' + place._id}
              className="block cursor-pointer gap-4 bg-gray-300 p-4 rounded-2xl"
              style={{ marginBottom: '16px' }}
            >
              <h2 className="font-bold">
                <span style={{ color: 'orange' }}>pick-up area:</span> {place.destination}
              </h2>
              <h3 className="text-sm text-gray-500">
                <span style={{ color: 'orange' }}>Destination:</span> {place.from}
              </h3>
              <div className="mt-1">
                <span className="font-bold">R{place.price}</span> per person
              </div>
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
}
