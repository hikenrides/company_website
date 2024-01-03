import {Link, useParams} from "react-router-dom";
import AccountNav from "../AccountNav";
import {useEffect, useState} from "react";
import axios from "axios";
export default function RequestsPage() {
  const [requests,setRequests] = useState([]);
  useEffect(() => {
    axios.get('/requested-trips', { withCredentials: true }).then(({data}) => {
      setRequests(data);
    });
  }, []);
  return (
    <div>
      <div className="hidden md:block">
      <AccountNav />
      </div>
        <div className="text-center">
          <Link className="inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full" to={'/account/Myrequests/new'}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
            </svg>
            Add trip request
          </Link>
        </div>
        <div className="mt-4">
          {requests.length > 0 && requests.map(request => (
            <Link to={'/account/Myrequests'+request._id} className="flex cursor-pointer gap-4 bg-gray-300 p-4 rounded-2xl"
             style={{ marginBottom: '16px' }} >
              <div className="grow-0 shrink" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <h2 className="text-xl" style={{ color: 'orange', marginRight: '8px' }}>pick-up area: </h2><span>{request.from}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <h2 className="text-xl" style={{ color: 'orange', marginRight: '8px' }}>destination: </h2><span>{request.destination}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <h2 style={{ color: 'orange', marginRight: '8px' }}>price: </h2><span>{request.price} per person</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
              <p className="text-sm mt-2" style={{ color: 'orange', marginRight: '8px' }}>date: </p>
<span>{new Date(request.date).toLocaleDateString('en-US')}</span>

              </div>
            </div>
            </Link>
          ))}
        </div>
    </div>
  );
}