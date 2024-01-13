import React, { useState } from 'react';

const WithdrawForm = () => {
  const [amount, setAmount] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [bankName, setBankName] = useState('');
  // ... add other fields as needed (e.g., branch code, ID number, etc.)

  const handleWithdraw = () => {
    // Implement withdrawal logic here (e.g., send a request to your backend)
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md text-white max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Withdraw Funds</h2>
      <form onSubmit={handleWithdraw}>
        <div className="mb-4">
          <label htmlFor="amount" className="block text-sm font-medium text-gray-400">
            Amount:
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        
<div
 
className="mb-4">

          
<label
 
htmlFor="accountNumber" className="block text-sm font-medium text-gray-400">
            Account Number:
          </label>
          <input
            type="text"
            id="accountNumber"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        
<div
 
className="mb-4">

          
<label
 
htmlFor="accountHolderName" className="block text-sm font-medium text-gray-400">
            Account Holder Name:
          </label>
          <input
            type="text"
            id="accountHolderName"
            value={accountHolderName}
            onChange={(e) => setAccountHolderName(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        
<div
 
className="mb-4">

          
<label
 
htmlFor="bankName" className="block text-sm font-medium text-gray-400">
            Bank Name:
          </label>
          <input
            type="text"
            id="bankName"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        {/* Add other fields as needed */}
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Withdraw
        </button>
      </form>
    </div>
  );
};

export default WithdrawForm;