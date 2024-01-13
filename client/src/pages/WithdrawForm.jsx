import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";

const WithdrawForm = () => {
  const [amount, setAmount] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [bankName, setBankName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleWithdraw = async (e) => {
    e.preventDefault();

    try {
      // Send a request to the backend to handle withdrawal
      const response = await axios.post('/withdrawals', {
        amount,
        accountNumber,
        accountName,
        bankName,
      });

      // Handle the response as needed
      console.log('Withdrawal successful:', response.data);
      navigate("/account");


      // Reset the form and error state
      setAmount('');
      setAccountNumber('');
      setAccountName('');
      setBankName('');
      setError('');
    } catch (error) {
      // Handle errors from the backend
      console.error('Withdrawal Error:', error.response.data.error);
      setError('Error processing withdrawal. Please try again.');
    }
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
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
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