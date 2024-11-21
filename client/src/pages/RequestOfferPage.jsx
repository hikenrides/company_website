import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
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

  const handleSearch = (from, destination) => {
    setSearchPerformed(true);
    if (requests.length === 0) {
      axios.get('/requests').then(response => {
        const activeRequests = response.data.filter(request => request.status === "active");
        setRequests(activeRequests);
        filterAndLogResults(activeRequests, from, destination);
      }).catch(error => {
        console.error("Error fetching requests: ", error);
      });
    } else {
      filterAndLogResults(requests, from, destination);
    }
  };

  const filterAndLogResults = (requests, from, destination) => {
    const fromKeywords = from.toLowerCase().split(/[\s,]+/);
    const destinationKeywords = destination.toLowerCase().split(/[\s,]+/);
  
    const result = requests.filter((request) => {
      const fromField = request.from.toLowerCase();
      const destinationField = request.destination.toLowerCase();
      const fromMatches = fromKeywords.some(keyword => fromField.includes(keyword));
      const destMatches = destinationKeywords.some(keyword => destinationField.includes(keyword));
  
      return (
        (selectedProvince ? request.province2 === selectedProvince : true) &&
        (fromMatches || destMatches)
      );
    });

    const sortedResults = result.sort((a, b) => {
      const exactFromA = fromKeywords.some(keyword => a.from.toLowerCase() === keyword);
      const exactDestA = destinationKeywords.some(keyword => a.destination.toLowerCase() === keyword);
      const exactFromB = fromKeywords.some(keyword => b.from.toLowerCase() === keyword);
      const exactDestB = destinationKeywords.some(keyword => b.destination.toLowerCase() === keyword);

      return (exactFromB + exactDestB) - (exactFromA + exactDestA);
    });
requ
    setMatchingRequests(sortedResults);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const formattedDate = new Date(dateString).toLocaleDateString('en-US', options);
    return formattedDate;
  };

  const navigateToRequest = (id) => {
    if (user && user.verification !== "not verified") {
      navigate(`/request/${id}`);
    } else {
      alert("Only verified users can view available .");
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
              matchingRequests.length > 0 ? (
                <div className="results-container mt-4">
                  <h3 className="text-center mb-4 text-gray-700 font-semibold">Matching Requests</h3>
                  <div className="overflow-x-auto mb-4">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
                      <thead className="bg-gray-300">
                        <tr>
                          <th className="p-2 text-sm font-medium text-gray-700">Pick-up Area</th>
                          <th className="p-2 text-sm font-medium text-gray-700">Destination</th>
                          <th className="p-2 text-sm font-medium text-gray-700">Date</th>
                          <th className="p-2 text-sm font-medium text-gray-700">Price (R)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {matchingRequests.map((request, index) => (
                          <tr key={request._id} className={`${
                            index % 2 === 0 ? 'bg-white' : 'bg-gray-300'
                          } border-b border-gray-100 hover:bg-gray-50 cursor-pointer`}>
                            <td className="p-3 text-center text-gray-600">{request.province}, {request.from}</td>
                            <td className="p-3 text-center text-gray-600">{request.province2}, {request.destination}</td>
                            <td className="p-3 text-center text-gray-600">{formatDate(request.date)}</td>
                            <td className="p-3 text-center text-gray-600">R{request.price}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <p className="text-center text-red-500 font-semibold mt-4">No matching requests found. Please refine your search.</p>
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
                <div className="p-4 overflow-x-auto">
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
  {requests.filter(request => request.province2 === province).map((request, index) => (
    <tr 
      key={request._id} 
      className={`${
        index % 2 === 0 ? 'bg-white' : 'bg-gray-300'
      } border-b border-gray-100 hover:bg-gray-50 cursor-pointer`}
      onClick={() => navigateToRequest(request._id)}
    >
      <td className="p-3 text-center text-gray-600">{request.province}, {request.from}</td>
      <td className="p-3 text-center text-gray-600">{request.province2}, {request.destination}</td>
      <td className="p-3 text-center text-gray-600">{formatDate(request.date)}</td>
      <td className="p-3 text-center text-gray-600">R{request.price}</td>
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
