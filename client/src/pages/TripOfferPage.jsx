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
  const [selectedProvince, setSelectedProvince] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchError, setSearchError] = useState(false);

  useEffect(() => {
    axios.get("/places").then((response) => {
      setPlaces(response.data);
    });
  }, []);

  const handleProvinceSelect = (province) => {
    setSelectedProvince((prevState) =>
      prevState === province ? "" : province
    );
  };

  const handleSearch = (fromLocation, toLocation) => {
    const matchingPlaces = places.filter(
      (place) =>
        place.from.toLowerCase().includes(fromLocation.toLowerCase()) &&
        place.destination.toLowerCase().includes(toLocation.toLowerCase()) &&
        (selectedProvince ? place.province === selectedProvince : true)
    );

    if (matchingPlaces.length > 0) {
      setSearchResults(matchingPlaces);
      setSearchError(false);
    } else {
      setSearchResults([]);
      setSearchError(true);
    }
  };

  return (
    <div className="mt-20">
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
            </Row>
          </Container>
        </div>
      </section>
      {provinces.map((province, index) => (
        <div key={index}>
          <h2
            className="cursor-pointer bg-gray-300 p-4 rounded-2xl flex justify-between items-center"
            onClick={() => handleProvinceSelect(province)}
            style={{ marginBottom: "16px" }}
          >
            {province} {selectedProvince === province ? "▲" : "▼"}
          </h2>

          {selectedProvince === province &&
            (searchResults.length > 0 ? (
              searchResults.map((place) => (
                <Link
                  key={place._id}
                  to={"/place/" + place._id}
                  className="block cursor-pointer gap-4 bg-gray-300 p-4 rounded-2xl"
                  style={{ marginBottom: "16px" }}
                >
                  <h2 className="font-bold">
                    <span style={{ color: "orange" }}>pick-up area:</span>{" "}
                    {place.destination}
                  </h2>
                  <h3 className="text-sm text-gray-500">
                    <span style={{ color: "orange" }}>Destination:</span>{" "}
                    {place.from}
                  </h3>
                  <div className="mt-1">
                    <span className="font-bold">R{place.price}</span> per person
                  </div>
                </Link>
              ))
            ) : searchError ? (
              <p>No trips found with the entered location.</p>
            ) : (
              places
                .filter((place) => place.province === province)
                .map((place) => (
                  <Link
                    key={place._id}
                    to={"/place/" + place._id}
                    className="block cursor-pointer gap-4 bg-gray-300 p-4 rounded-2xl"
                    style={{ marginBottom: "16px" }}
                  >
                    <h2 className="font-bold">
                      <span style={{ color: "orange" }}>pick-up area:</span>{" "}
                      {place.destination}
                    </h2>
                    <h3 className="text-sm text-gray-500">
                      <span style={{ color: "orange" }}>Destination:</span>{" "}
                      {place.from}
                    </h3>
                    <div className="mt-1">
                      <span className="font-bold">R{place.price}</span> per person
                    </div>
                  </Link>
                ))
            ))}
        </div>
      ))}
    </div>
  );
}
