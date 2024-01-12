import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import FindCarForm from "../FindCarForm";
import { Container, Row, Col } from "reactstrap";

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
  const [requests, setRequests] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [matchingRequets, setMatchingRequests] = useState([]);


  useEffect(() => {
    axios.get('/requests', { withCredentials: true }).then(response => {
      setRequests(response.data);
    }).catch(error => {
      console.error("Error fetching requests: ", error);
    });
  }, []);

  const handleProvinceSelect = (province) => {
    setSelectedProvince(prevState => prevState === province ? '' : province);
  };

  const handleSearch = (selectedProvince, destination) => {
    // Check if places data is available
    if (requests.length === 0) {
      // Fetch places data again or handle appropriately
      axios.get('/requests').then(response => {
        setRequests(response.data);
        filterAndLogResults(response.data, selectedProvince, destination);
      });
    } else {
      // Places data is available, proceed to filter and log results
      filterAndLogResults(requests, selectedProvince, destination);
    }
  };

  const filterAndLogResults = (requests, selectedProvince, destination) => {
    // Filter places based on selected province and destination
    const result = requests.filter((request) => {
      const normalizedDestination = request.destination.toLowerCase();
      const normalizedInput = destination.toLowerCase();

      return (
        (selectedProvince ? request.province2 === selectedProvince : true) &&
        normalizedDestination.includes(normalizedInput)
      );
    });

    // Update your UI with the matching places or display a message
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
              {matchingRequets.length > 0 && (
                <div>
                  {matchingRequets.map((request) => (
                     <Link
                     key={request._id}
                     to={`/request/${request._id}`}
                     className="block cursor-pointer gap-4 bg-gray-300 p-4 rounded-2xl"
                     style={{ marginBottom: '16px' }}
                   >
                     <h2 className="font-bold">
                       <span style={{ color: 'orange' }}>pick-up area:</span> {request.province}, {request.from}
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
          {selectedProvince === province && requests.filter(request => request.province === province).map(request => (
            <Link
              key={request._id}
              to={`/request/${request._id}`}
              className="block cursor-pointer gap-4 bg-gray-300 p-4 rounded-2xl"
              style={{ marginBottom: '16px' }}
            >
              <h2 className="font-bold">
                <span style={{ color: 'orange' }}>pick-up area:</span> {request.province}, {request.from}
              </h2>
              <h3 className="text-sm text-gray-500">
                <span style={{ color: 'orange' }}>Destination:</span> {request.province2}, {request.destination}
              </h3>
              <h3 className="text-sm text-gray-500">
                <span style={{ color: 'orange' }}>Date:</span> {request.date}
              </h3>
              <div className="mt-1">
                <span className="font-bold">R{request.price}</span> per person
              </div>
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
}
