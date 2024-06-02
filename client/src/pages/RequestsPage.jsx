import { Link, useParams } from "react-router-dom";
import AccountNav from "../AccountNav";
import { useEffect, useState } from "react";
import axios from "axios";

export default function RequestsPage() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    axios.get('/requested-trips', { withCredentials: true }).then(({ data }) => {
      setRequests(data);
    });
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '60vh' }}>
      <div className="hidden md:block">
        <AccountNav />
      </div>
      <div className="text-center mb-4"> {/* Added spacing for mobile view */}
        <Link
          className="inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full"
          to={'/account/Myrequests/new'}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
          </svg>
          Add trip request
        </Link>
      </div>
      <div className="flex flex-wrap gap-4"> {/* Use flex-wrap for mobile responsiveness */}
        {requests.length > 0 &&
          requests.map((request) => (
            <Link
              key={request._id}
              to={`/account/Myrequests/${request._id}`}
              className="w-full flex cursor-pointer shadow-md rounded-2xl overflow-hidden p-4 mb-4"
              style={{ backgroundColor: 'white' }}
            >
              <div className="grow"> {/* Utilize flex-grow for better content distribution */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <h2 className="text-xl font-medium" style={{ color: 'orange', marginRight: '8px' }}>pick-up area:</h2>
                  <span>{request.from}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <h2 className="text-xl font-medium" style={{ color: 'orange', marginRight: '8px' }}>destination:</h2>
                  <span>{request.destination}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <h2 style={{ color: 'orange', marginRight: '8px' }}>price:</h2>
                  <span>{request.price} per person</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <p className="text-sm mt-2" style={{ color: 'orange', marginRight: '8px' }}>date:</p>
                  <span>{new Date(request.date).toLocaleDateString('en-US')}</span>
                </div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}
