import React, { useState } from "react";
import "./find-car-form.css";
import { Form, FormGroup } from "reactstrap";
//import { FaUser, FaCalendarAlt } from "react-icons/fa";

const FindCarForm = ({ onSearch }) => {
  const [from, setFrom] = useState("");
  const [destination, setDestination] = useState("");
  //const [passengerCount, setPassengerCount] = useState(1);
  //const [date, setDate] = useState("");

  const handleSearch = () => {
    onSearch(from, destination);
  };

  return (
    <Form className="form-container mt-20 mb-8">
      <div className="search-bar">
        {/* Leaving From */}
        <FormGroup className="form__group">
          <input
            type="text"
            placeholder="Leaving from"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="input-field"
            required
          />
        </FormGroup>

        {/* Going To */}
        <FormGroup className="form__group">
          <input
            type="text"
            placeholder="Going to"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="input-field"
            required
          />
        </FormGroup>

       
        {/*<FormGroup className="form__group icon-field">
          <FaCalendarAlt className="icon" />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="input-field"
          />
        </FormGroup>

       
        <FormGroup className="form__group icon-field">
          <FaUser className="icon" />
          <select
            value={passengerCount}
            onChange={(e) => setPassengerCount(e.target.value)}
            className="input-field"
          >
            {[...Array(5).keys()].map((num) => (
              <option key={num + 1} value={num + 1}>
                {num + 1} passenger{num > 0 && "s"}
              </option>
            ))}
          </select>
        </FormGroup>*/}

        {/* Search Button */}
        <button type="button" className="search-btn" onClick={handleSearch}>
          Search
        </button>
      </div>
    </Form>
  );
};

export default FindCarForm;
