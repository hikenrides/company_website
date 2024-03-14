import React, { useState } from "react";
import { Link } from "react-router-dom";

const WithdrawPage = () => {
  const [ozowError, setOzowError] = useState(false);

  const handleOzowClick = () => {
    // Add your logic to check if the Ozow payment method is available
    // For now, let's simulate an error by always displaying the error message
    setOzowError(true);
  };

  return (
    <div className="text-center max-w-lg mx-auto text-white">
    <h2 className="text-xl mb-4">Deposit Options</h2>
    <div className="flex flex-col gap-4 items-center">
        
      <Link to={'/WithdrawalForm'}>
      <div className="bg-blue-400 text-white py-2 px-4 rounded text-center">
        <h1>
          <svg xmlns="http://www.w3.org/2000/svg" height="16" width="20" viewBox="0 0 640 512" className="mx-auto">
            <path d="M535 41c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l64 64c4.5 4.5 7 10.6 7 17s-2.5 12.5-7 17l-64 64c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l23-23L384 112c-13.3 0-24-10.7-24-24s10.7-24 24-24l174.1 0L535 41zM105 377l-23 23L256 400c13.3 0 24 10.7 24 24s-10.7 24-24 24L81.9 448l23 23c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0L7 441c-4.5-4.5-7-10.6-7-17s2.5-12.5 7-17l64-64c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9zM96 64H337.9c-3.7 7.2-5.9 15.3-5.9 24c0 28.7 23.3 52 52 52l117.4 0c-4 17 .6 35.5 13.8 48.8c20.3 20.3 53.2 20.3 73.5 0L608 169.5V384c0 35.3-28.7 64-64 64H302.1c3.7-7.2 5.9-15.3 5.9-24c0-28.7-23.3-52-52-52l-117.4 0c4-17-.6-35.5-13.8-48.8c-20.3-20.3-53.2-20.3-73.5 0L32 342.5V128c0-35.3 28.7-64 64-64zm64 64H96v64c35.3 0 64-28.7 64-64zM544 320c-35.3 0-64 28.7-64 64h64V320zM320 352a96 96 0 1 0 0-192 96 96 0 1 0 0 192z"/>
          </svg>
          Withdraw
        </h1>
        <h2>
          Note: withdrawals take up to 48 hours to be processed, Enter the correct bank details...
        </h2>
      </div>
      </Link>
    </div>
  </div>
  );
};

export default WithdrawPage;
