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
  const [searchPerformed, setSearchPerformed] = useState(false);

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
                          <th className="p-2 text-sm font-medium text-gray-700">Price (R)</th>
                          <th className="p-2 text-sm font-medium text-gray-700">Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        {requests.filter(request => request.province2 === province).map((request) => (
                          <tr key={request._id} className="bg-white border-b border-gray-100 hover:bg-gray-50">
                            <td className="p-3 text-center text-gray-600">{request.province}, {request.from}</td>
                            <td className="p-3 text-center text-gray-600">{request.province2}, {request.destination}</td>
                            <td className="p-3 text-center text-gray-600">{formatDate(request.date)}</td>
                            <td className="p-3 text-center text-gray-600">R{request.price}</td>
                            <td className="p-3 text-center">
                              <Link
                                to={user && user.verification !== "not verified" ? `/trip/${request._id}` : "#"}
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
