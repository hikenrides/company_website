import React, { useState } from "react";
import "./find-car-form.css";
import { Form, FormGroup } from "reactstrap";

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

const FindCarForm = ({ onSearch }) => {
  const [selectedProvince, setSelectedProvince] = useState("");
  const [destination, setDestination] = useState("");

  const handleSearch = () => {
    // Call the onSearch prop with the selected province and destination
    onSearch(selectedProvince, destination);
  };

  return (
    <Form className="form">
      <div className="d-flex align-items-center justify-content-between flex">
        <FormGroup className="form__group">
          <select
            value={selectedProvince}
            onChange={(e) => setSelectedProvince(e.target.value)}
            required
          >
            <option value="" disabled>
              Select Province
            </option>
            {provinces.map((province) => (
              <option key={province} value={province}>
                {province}
              </option>
            ))}
          </select>
        </FormGroup>

        <FormGroup className="form__group flex">
          <input
            type="text"
            placeholder="City, Town"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            required
          />
          <button type="button" onClick={handleSearch}>
            Search
          </button>
        </FormGroup>
      </div>
    </Form>
  );
};

export default FindCarForm;