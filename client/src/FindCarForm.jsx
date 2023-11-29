import React, { useState } from "react";
import "./find-car-form.css";
import { Form, FormGroup } from "reactstrap";

const FindCarForm = ({ onSearch }) => {
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");

  const handleSearch = () => {
    onSearch({ fromLocation, toLocation });
  };

  return (
    <Form className="form">
      <div className="d-flex align-items-center justify-content-between flex">
        <FormGroup className="form__group">
          <input
            type="text"
            placeholder="From location"
            value={fromLocation}
            onChange={(e) => setFromLocation(e.target.value)}
            required
          />
        </FormGroup>

        <FormGroup className="form__group flex">
          <input
            type="text"
            placeholder="To location"
            value={toLocation}
            onChange={(e) => setToLocation(e.target.value)}
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
