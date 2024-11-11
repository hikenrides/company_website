import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Container, Row, Col } from "reactstrap";
import { Link } from "react-router-dom";
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
  const [places, setPlaces] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [matchingPlaces, setMatchingPlaces] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false);

  useEffect(() => {
    axios.get('/places', { withCredentials: true }).then(response => {
      const activePlaces = response.data.filter(place => place.status === "active");
      setPlaces(activePlaces);
    });
  }, []);

  const handleProvinceSelect = (province) => {
    setSelectedProvince(prevState => prevState === province ? '' : province);
  };

  const handleSearch = (selectedProvince, destination) => {
    if (places.length === 0) {
      axios.get('/places').then(response => {
        const activePlaces = response.data.filter(place => place.status === "active");
        setPlaces(activePlaces);
        filterAndLogResults(activePlaces, selectedProvince, destination);
      });
    } else {
      filterAndLogResults(places, selectedProvince, destination);
    }
    setSearchPerformed(true);
  };

  const filterAndLogResults = (places, selectedProvince, destination) => {
    const result = places.filter((place) => {
      const normalizedDestination = place.destination.toLowerCase();
      const normalizedInput = destination.toLowerCase();
      return (
        (selectedProvince ? place.province2 === selectedProvince : true) &&
        normalizedDestination.includes(normalizedInput)
      );
    });
    setMatchingPlaces(result.length > 0 ? result : []);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
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
            {searchPerformed && matchingPlaces.length === 0 && (
              <p className="text-center text-red-500 font-semibold">
                No matching trips found. Please refine your search.
              </p>
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
                <div className="p-4">
                  <div className="table-responsive">
                    <table className="min-w-full table-fixed bg-white border border-gray-200 rounded-lg overflow-hidden">
                      <thead className="bg-gray-300">
                        <tr>
                          <th className="p-2 text-sm font-medium text-gray-700">Pick-up Area</th>
                          <th className="p-2 text-sm font-medium text-gray-700">Destination</th>
                          <th className="p-2 text-sm font-medium text-gray-700">Date</th>
                          <th className="p-2 text-sm font-medium text-gray-700">Price</th>
                          <th className="p-2 text-sm font-medium text-gray-700">Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        {places.filter(place => place.province2 === province).map((place) => (
                          <tr key={place._id} className="bg-white border-b border-gray-100 hover:bg-gray-50">
                            <td className="p-3 text-center text-gray-600">{place.province}, {place.from}</td>
                            <td className="p-3 text-center text-gray-600">{place.province2}, {place.destination}</td>
                            <td className="p-3 text-center text-gray-600">{formatDate(place.date)}</td>
                            <td className="p-3 text-center text-gray-600">R{place.price}</td>
                            <td className="p-3 text-center">
                              <Link
                                to={user && user.verification !== "not verified" ? `/trip/${place._id}` : "#"}
                                onClick={(e) => {
                                  if (user && user.verification === "not verified") {
                                    e.preventDefault();
                                    alert("Only verified users can view available trips.");
                                  }
                                }}
                                className="text-blue-500 font-semibold hover:underline"
                              >
                                View
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
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
