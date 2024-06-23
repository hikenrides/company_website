import React, { useState } from 'react';
import axios from 'axios';

const VerificationPage = () => {
  const [idPhoto, setIdPhoto] = useState(null);
  const [documentPhoto, setDocumentPhoto] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleIdPhotoChange = (e) => {
    setIdPhoto(e.target.files[0]);
  };

  const handleDocumentPhotoChange = (e) => {
    setDocumentPhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    const formData = new FormData();
    formData.append('idPhoto', idPhoto);
    formData.append('documentPhoto', documentPhoto);

    try {
      const response = await axios.post('/upload-verification', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Verification documents uploaded successfully!');
    } catch (error) {
      console.error('Error uploading verification documents', error);
      alert('Failed to upload verification documents.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto text-white bg-gray-800 p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Upload Verification Documents</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block mb-2 text-lg font-semibold">Photo holding your ID:</label>
          <input
            type="file"
            onChange={handleIdPhotoChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-700 text-white"
          />
          <p className="text-sm text-gray-400 mt-2">
            Note: This is for safety purposes to ensure that users don't create fake profiles or upload documents that don't belong to them.
          </p>
        </div>
        <div className="mb-6">
          <label className="block mb-2 text-lg font-semibold">Photo of your ID:</label>
          <input
            type="file"
            onChange={handleDocumentPhotoChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-700 text-white"
          />
        </div>
        <button
          type="submit"
          className={`w-full py-3 rounded-md text-lg font-semibold transition-colors duration-300 ${uploading ? 'bg-gray-500' : 'bg-green-500 hover:bg-green-600'}`}
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default VerificationPage;
