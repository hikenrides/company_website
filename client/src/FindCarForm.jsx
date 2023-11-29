import React from "react";
import "./find-car-form.css";
import { Form, FormGroup } from "reactstrap";

const FindCarForm = () => {
  return (
    <Form className="form">
      <div className="d-flex align-items-center justify-content-between flex">
        <FormGroup className="form__group">
          <input type="text" placeholder="From address" required />
        </FormGroup>

        <FormGroup className="form__group">
          <input type="text" placeholder="To address" required />
        </FormGroup>

        <FormGroup className="form__group flex">
          <input type="date" placeholder="Journey date" required />
        </FormGroup>
        
        
      </div>
    </Form>
  );
};

export default FindCarForm;
