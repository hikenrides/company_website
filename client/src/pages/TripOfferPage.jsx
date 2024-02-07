import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col } from "reactstrap";
import { Link } from "react-router-dom";
import FindCarForm from "../FindCarForm";

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
  const [matchingPlaces, setMatchingPlaces] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false);

  useEffect(() => {
    axios.get('/places', { withCredentials: true }).then(response => {
      setPlaces(response.data);
    });
  }, []);

  const handleProvinceSelect = (province) => {
    setSelectedProvince(prevState => prevState === province ? '' : province);
  };

  const handleSearch = (selectedProvince, destination) => {
    // Check if places data is available
    if (places.length === 0) {
      // Fetch places data again or handle appropriately
      axios.get('/places').then(response => {
        setPlaces(response.data);
        filterAndLogResults(response.data, selectedProvince, destination);
      });
    } else {
      // Places data is available, proceed to filter and log results
      filterAndLogResults(places, selectedProvince, destination);
    }

    // Set the searchPerformed state to true
    setSearchPerformed(true);
  };

  const filterAndLogResults = (places, selectedProvince, destination) => {
    // Filter places based on selected province and destination
    const result = places.filter((place) => {
      const normalizedDestination = place.destination.toLowerCase();
      const normalizedInput = destination.toLowerCase();

      return (
        (selectedProvince ? place.province2 === selectedProvince : true) &&
        normalizedDestination.includes(normalizedInput)
      );
    });
    // Update your UI with the matching places or display a message
    if (result.length > 0) {
      setMatchingPlaces(result);
    } else {
      setMatchingPlaces([]);
      console.log("No matching Trips found.");
    }
  };
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const formattedDate = new Date(dateString).toLocaleDateString('en-US', options);
    return formattedDate;
  };

  return (
    <div className="mt-10 mb-20">
      <section className="p-0 mb-10">
        <div className="hero__form">
          <Container>
            <Row className="form__row">
              <Col lg="4" md="4">
                <div className="find__cars-left">
                  <h2>where are you going?</h2>
                </div>
              </Col>

              <Col lg="8" md="8" sm="12">
                <FindCarForm onSearch={handleSearch} />
              </Col>
              {searchPerformed && matchingPlaces.length === 0 && (
                // Display "No matching Trips found" message with styling
                <p className="text-red-300">
                  No matching Trips found. Please refine your search criteria.
                </p>
              )}
              {matchingPlaces.length > 0 ? (
                <div>
                  {matchingPlaces.map((place) => (
                    <Link
                      key={place._id}
                      to={'/trip/' + place._id}
                      className="block cursor-pointer gap-4 bg-gray-300 p-4 rounded-2xl"
                      style={{ marginBottom: '16px' }}
                    >
                      <h2 className="font-bold">
                        <span style={{ color: 'orange' }}>pick-up area:</span> {place.province}, {place.from}
                      </h2>
                      <h3 className="text-sm text-gray-500">
                        <span style={{ color: 'orange' }}>Destination:</span> {place.province2}, {place.destination}
                      </h3>
                      <h3 className="text-sm text-gray-500">
                        <span style={{ color: 'orange' }}>Date:</span> {formatDate(place.date)}
                      </h3>
                      <div className="mt-1">
                        <span className="font-bold">R{place.price}</span> per person
                      </div>
                    </Link>
                  ))}
                </div>
              ) : null}
            </Row>
          </Container>
        </div>
      </section>
      {provinces.map((province, index) => (
        <div key={index}>
          <h2
            className="cursor-pointer bg-gray-300 p-4 rounded-2xl flex justify-between items-center"
            onClick={() => handleProvinceSelect(province)}
            style={{ marginBottom: '16px' }}
          >
            {province} {selectedProvince === province ? '▲' : '▼'}
          </h2>

          {selectedProvince === province && places.filter(place => place.province2 === province).map(place => (
            <Link
              key={place._id}
              to={'/trip/' + place._id}
              className="block cursor-pointer gap-4 bg-gray-100 p-4 rounded-2xl"
              style={{ marginBottom: '16px' }}
            >
              <h2 className="font-bold">
                <span style={{ color: 'orange' }}>pick-up area:</span> {place.province}, {place.from}
              </h2>
              <h3 className="text-sm text-gray-500">
                <span style={{ color: 'orange' }}>Destination:</span> {place.province2}, {place.destination}
              </h3>
              <h3 className="text-sm text-gray-500">
                <span style={{ color: 'orange' }}>Date:</span> {formatDate(place.date)}
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
