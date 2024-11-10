import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

export default function BookingPage() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const slipRef = useRef(null); // Ref to hold the slip for PDF generation

  useEffect(() => {
    if (id) {
      axios.get('/bookings', { withCredentials: true }).then((response) => {
        const foundBooking = response.data.find(({ _id }) => _id === id);
        if (foundBooking) {
          setBooking(foundBooking);
        }
      });
    }
  }, [id]);

  if (!booking) {
    return 'Loading...';
  }

  if (!booking.place) {
    return 'Booking place not found';
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const downloadPDF = async () => {
    const element = slipRef.current;
    const downloadButton = document.getElementById('downloadButton');
  
    // Hide the download button with opacity to avoid layout shifts
    downloadButton.style.opacity = '0';
  
    setTimeout(async () => {
      const scale = 2; // Scale up to improve quality
      const canvas = await html2canvas(element, { scale });
  
      const imgData = canvas.toDataURL('image/png');
      const pdfWidth = 190; // Fit the content width within the PDF page
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
      const pdf = new jsPDF('p', 'mm', [pdfWidth, pdfHeight + 10]); // Add padding at the bottom
    
      pdf.addImage(imgData, 'PNG', 10, 10, pdfWidth, pdfHeight);
      pdf.save("booking_slip.pdf");
  
      // Restore the download button's visibility after rendering
      downloadButton.style.opacity = '1';
    }, 100); // Adjust delay if needed
  };
  

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div ref={slipRef} className="w-80 rounded bg-gray-50 px-6 pt-8 shadow-lg">
        <img src="/images/hikenrides.png" alt="Booking" className="mx-auto w-16 py-4" />
        <div className="flex flex-col items-center gap-2">
          <h4 className="font-semibold">Hikenrides</h4>
          <p className="text-xs">{booking.place.destination}</p>
        </div>
        <div className="flex flex-col gap-3 border-b py-6 text-xs">
          <p className="flex justify-between">
            <span className="text-gray-400">Reference No.:</span>
            <span>{booking.reference}</span>
          </p>
          <p className="flex justify-between">
            <span className="text-gray-400">Pick-up Location:</span>
            <span>{booking.place.from}</span>
          </p>
          <p className="flex justify-between">
            <span className="text-gray-400">Car:</span>
            <span>{booking.place.color}, {booking.place.brand}</span>
          </p>
          <p className="flex justify-between">
            <span className="text-gray-400">Date:</span>
            <span>{formatDate(booking.place.date)}</span>
          </p>
          <p className="flex justify-between">
            <span className="text-gray-400">Driver Contact:</span>
            <span>0{booking.owner_number}</span>
          </p>
        </div>
        <div className="flex flex-col items-center gap-3 py-6 pt-2">
          <div className="text-gray-400">Total Price</div>
          <div className="text-3xl text-black">R{booking.price}</div>
        </div>
        <div className="py-4 flex flex-col items-center gap-2 text-xs">
          <p className="flex gap-2 items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none">
              {/* SVG path */}
            </svg>
            info@hikenrides.com
          </p>
          <p className="flex gap-2 items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none">
              {/* SVG path */}
            </svg>
            +1 (555) 123-4567
          </p>
        </div>
        <button
          id="downloadButton"
          onClick={downloadPDF}
          className="w-full rounded bg-blue-600 py-2 text-white mb-5"
        >
          Download as PDF
        </button>
      </div>
    </div>
  );
}
