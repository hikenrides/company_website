import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Container, Row, Col } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import FindCarForm from "../FindCarForm";
import { UserContext } from "../UserContext";
import Footer from "../footer";

const provinces = [
  "Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal",
  "Limpopo", "Mpumalanga", "North West", "Northern Cape",
  "Western Cape"
];

export default function TripOfferPage() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [places, setPlaces] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [matchingPlaces, setMatchingPlaces] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false);

  useEffect(() => {
    axios.get('/places', { withCredentials: true }).then(response => {
      const activePlaces = response.data.filter(
        place => place.status === "active" && place.maxGuests > 0
      );
      setPlaces(activePlaces);
    });
  }, []);

  const handleProvinceSelect = (province) => {
    setSelectedProvince(prevState => prevState === province ? '' : province);
  };

  const handleSearch = (from, destination) => {
    setSearchPerformed(true);
    if (places.length === 0) {
      axios.get('/places').then(response => {
        const activePlaces = response.data.filter(
          place => place.status === "active" && place.maxGuests > 0
        );
        setPlaces(activePlaces);
        filterAndLogResults(activePlaces, from, destination);
      });
    } else {
      filterAndLogResults(places, from, destination);
    }
  };

  const filterAndLogResults = (places, from, destination) => {
    const fromKeywords = from.toLowerCase().split(/[\s,]+/);
    const destinationKeywords = destination.toLowerCase().split(/[\s,]+/);
  
    const result = places.filter((place) => {
      const fromField = place.from.toLowerCase();
      const destinationField = place.destination.toLowerCase();
      const fromMatches = fromKeywords.some(keyword => fromField.includes(keyword));
      const destMatches = destinationKeywords.some(keyword => destinationField.includes(keyword));
  
      return fromMatches || destMatches;
    });

    const sortedResults = result.sort((a, b) => {
      const exactFromA = fromKeywords.some(keyword => a.from.toLowerCase() === keyword);
      const exactDestA = destinationKeywords.some(keyword => a.destination.toLowerCase() === keyword);
      const exactFromB = fromKeywords.some(keyword => b.from.toLowerCase() === keyword);
      const exactDestB = destinationKeywords.some(keyword => b.destination.toLowerCase() === keyword);
  
      return (exactFromB + exactDestB) - (exactFromA + exactDestA);
    });
  
    setMatchingPlaces(sortedResults);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const navigateToTrip = (id) => {
    if (user && user.verification !== "not verified") {
      navigate(`/trip/${id}`);
    } else {
      alert("Only verified users can view available trips.");
    }
  };

  return (
    <div className="min-h-screen">
      <div className="min-h-screen flex flex-col justify-between">
        <Container className="max-w-7xl mx-auto px-4">
          <Row className="justify-content-center mb-6">
            <Col lg="8" md="8" sm="12">
              <FindCarForm onSearch={handleSearch} />
            </Col>
          </Row>

          {searchPerformed && (
            matchingPlaces.length > 0 ? (
              <div className="results-container mt-4">
                <h3 className="text-center mb-4 text-gray-700 font-semibold">Matching Trips</h3>
                <div className="overflow-x-auto mb-4">
                  <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <thead className="bg-gray-300">
                      <tr>
                        <th className="p-2 text-sm font-medium text-gray-700">Pick-up Area</th>
                        <th className="p-2 text-sm font-medium text-gray-700">Destination</th>
                        <th className="p-2 text-sm font-medium text-gray-700">Date</th>
                        <th className="p-2 text-sm font-medium text-gray-700">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {matchingPlaces.map((place, index) => (
                        <tr 
                          key={place._id} 
                          className={`${
                            index % 2 === 0 ? 'bg-white' : 'bg-gray-300'
                          } border-b border-gray-100 hover:bg-gray-50 cursor-pointer`}
                          onClick={() => navigateToTrip(place._id)}
                        >
                          <td className="p-3 text-center text-gray-600">{place.province}, {place.from}</td>
                          <td className="p-3 text-center text-gray-600">{place.province2}, {place.destination}</td>
                          <td className="p-3 text-center text-gray-600">{formatDate(place.date)}</td>
                          <td className="p-3 text-center text-gray-600">R{place.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <p className="text-center text-red-500 font-semibold mt-4">No matching trips found. Please refine your search.</p>
            )
          )}
        </Container>

        <Container className="max-w-full mx-auto px-4">
          {provinces.map((province, index) => (
            <div key={index} className="bg-white shadow rounded-lg mb-4">
              <h2
                className="p-4 text-lg font-semibold text-gray-700 cursor-pointer bg-gray-200 rounded-t-lg flex justify-between items-center"
                onClick={() => handleProvinceSelect(province)}
              >
                {province}
                <span>{selectedProvince === province ? '▲' : '▼'}</span>
              </h2>
              {selectedProvince === province && (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <thead className="bg-gray-300">
                      <tr>
                        <th className="p-2 text-sm font-medium text-gray-700">Pick-up Area</th>
                        <th className="p-2 text-sm font-medium text-gray-700">Destination</th>
                        <th className="p-2 text-sm font-medium text-gray-700">Date</th>
                        <th className="p-2 text-sm font-medium text-gray-700">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {places.filter(place => place.province2 === province).map((place, index) => (
                        <tr 
                          key={place._id} 
                          className={`${
                            index % 2 === 0 ? 'bg-white' : 'bg-gray-300'
                          } border-b border-gray-100 hover:bg-gray-50 cursor-pointer`}
                          onClick={() => navigateToTrip(place._id)}
                        >
                          <td className="p-3 text-center text-gray-600">{place.province}, {place.from}</td>
                          <td className="p-3 text-center text-gray-600">{place.province2}, {place.destination}</td>
                          <td className="p-3 text-center text-gray-600">{formatDate(place.date)}</td>
                          <td className="p-3 text-center text-gray-600">R{place.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </Container>
      </div>
      <Footer />
    </div>
  );
}
