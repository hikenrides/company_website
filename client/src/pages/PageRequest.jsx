import {Link, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import BookingWidget2 from "../BookingWidget2";
import AddressLink from "../AddressLink";

export default function PageRequest() {
  const {id} = useParams();
  const [request,setRequest] = useState(null);
  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get(`/requests/${id}`, { withCredentials: true }).then(response => {
      setRequest(response.data);
    });
  }, [id]);

  if (!request) return '';



  return (
    <div className="mt-4 bg-gray-100 -mx-8 px-8 pt-8">
      <h1 className="text-3xl">{request.from}</h1>
      <AddressLink>{request.address}</AddressLink>
      <div className="mt-8 mb-8 grid gap-8 grid-cols-1 md:grid-cols-[2fr_1fr]">
        <div>
          Date: {request.date}<br />
          Max number of guests: {request.NumOfPassengers}
        </div>
        <div>
          <BookingWidget2 request={request} />
        </div>
      </div>
      <div className="bg-white -mx-8 px-8 py-8 border-t">
        <div>
          <h2 className="font-semibold text-2xl">Extra info</h2>
        </div>
        <div className="mb-4 mt-2 text-sm text-gray-700 leading-5">{request.extraInfo}</div>
      </div>
    </div>
  );
}
