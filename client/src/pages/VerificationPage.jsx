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
    <div className="max-w-lg mx-auto text-white">
      <h2 className="text-xl mb-4">Upload Verification Documents</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2">Photo holding your ID:</label>
          <input type="file" onChange={handleIdPhotoChange} required />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Photo of your ID:</label>
          <input type="file" onChange={handleDocumentPhotoChange} required />
        </div>
        <button type="submit" className="bg-gray-400 text-white py-2 px-6 rounded-full" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default VerificationPage;
