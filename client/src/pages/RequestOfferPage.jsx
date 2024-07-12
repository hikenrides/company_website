import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import FindCarForm from "../FindCarForm";
import { Container, Row, Col } from "reactstrap";
import { UserContext } from "../UserContext";
import Footer from "../footer";

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

export default function RequestOfferPage() {
  const { user } = useContext(UserContext);
  const [requests, setRequests] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [matchingRequests, setMatchingRequests] = useState([]);

  useEffect(() => {
    axios.get('/requests', { withCredentials: true }).then(response => {
      const activeRequests = response.data.filter(request => request.status === "active");
      setRequests(activeRequests);
    }).catch(error => {
      console.error("Error fetching requests: ", error);
    });
  }, []);

  const handleProvinceSelect = (province) => {
    setSelectedProvince(prevState => prevState === province ? '' : province);
  };

  const handleSearch = (selectedProvince, destination) => {
    if (requests.length === 0) {
      axios.get('/requests').then(response => {
        const activeRequests = response.data.filter(request => request.status === "active");
        setRequests(activeRequests);
        filterAndLogResults(activeRequests, selectedProvince, destination);
      });
    } else {
      filterAndLogResults(requests, selectedProvince, destination);
    }
  };

  const filterAndLogResults = (requests, selectedProvince, destination) => {
    const result = requests.filter((request) => {
      const normalizedDestination = request.destination.toLowerCase();
      const normalizedInput = destination.toLowerCase();

      return (
        (selectedProvince ? request.province2 === selectedProvince : true) &&
        normalizedDestination.includes(normalizedInput)
      );
    });

    if (result.length > 0) {
      setMatchingRequests(result);
    } else {
      setMatchingRequests([]);
      console.log("No matching Requests found.");
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const formattedDate = new Date(dateString).toLocaleDateString('en-US', options);
    return formattedDate;
  };

  return (
    <div className="mt-10">
      <section className="p-0 mb-10">
        <div className="hero__form">
          <Container>
            <Row className="form__row">
              <Col lg="4" md="4">
                <div className="find__cars-left">
                  <h2>Find out who's travelling your way</h2>
                </div>
              </Col>
              <Col lg="8" md="8" sm="12">
                <FindCarForm onSearch={handleSearch} />
              </Col>
              {matchingRequests.length > 0 && (
                <div>
                  {matchingRequests.map((request) => (
                    <Link
                      key={request._id}
                      to={user && user.verification !== "not verified" ? `/request/${request._id}` : '#'}
                      className="block cursor-pointer gap-4 bg-gray-300 p-4 rounded-2xl"
                      style={{ marginBottom: '16px' }}
                      onClick={(e) => {
                        if (user && user.verification === "not verified") {
                          e.preventDefault();
                          alert("Only verified users can view available requests.");
                        }
                      }}
                    >
                      <h2 className="font-bold">
                        <span style={{ color: 'orange' }}>Pick-up area:</span> {request.province}, {request.from}
                      </h2>
                      <h3 className="text-sm text-gray-500">
                        <span style={{ color: 'orange' }}>Destination:</span> {request.province2}, {request.destination}
                      </h3>
                      <h3 className="text-sm text-gray-500">
                        <span style={{ color: 'orange' }}>Date:</span> {formatDate(request.date)}
                      </h3>
                      <div className="mt-1">
                        <span className="font-bold">R{request.price}</span> per person
                      </div>
                    </Link>
                  ))}
                </div>
              )}
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
          {selectedProvince === province && (
            <>
              {requests.filter(request => request.province2 === province).map(request => (
                <Link
                  key={request._id}
                  to={user && user.verification !== "not verified" ? `/request/${request._id}` : '#'}
                  className="block cursor-pointer gap-4 bg-gray-100 p-4 rounded-2xl"
                  style={{ marginBottom: '16px' }}
                  onClick={(e) => {
                    if (user && user.verification === "not verified") {
                      e.preventDefault();
                      alert("Only verified users can view available requests.");
                    }
                  }}
                >
                  <h2 className="font-bold">
                    <span style={{ color: 'orange' }}>Pick-up area:</span> {request.province}, {request.from}
                  </h2>
                  <h3 className="text-sm text-gray-500">
                    <span style={{ color: 'orange' }}>Destination:</span> {request.province2}, {request.destination}
                  </h3>
                  <h3 className="text-sm text-gray-500">
                    <span style={{ color: 'orange' }}>Date:</span> {formatDate(request.date)}
                  </h3>
                  <div className="mt-1">
                    <span className="font-bold">R{request.price}</span> per person
                  </div>
                </Link>
              ))}
            </>
          )}
        </div>
      ))}
      <div className="mt-20">
        <Footer />
        </div>
    </div>
  );
}
