import React, { useState } from 'react';
import axios from 'axios';

const VerificationModal = ({ onClose }) => {
  const [idDocument, setIdDocument] = useState(null);
  const [photo, setPhoto] = useState(null);

  const handleIdDocumentChange = (e) => {
    setIdDocument(e.target.files[0]);
  };

  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append('idDocument', idDocument);
    formData.append('photo', photo);
  
    try {
      await axios.post('/upload-documents', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });
      onClose();
    } catch (error) {
      console.error('Error submitting verification:', error);
    }
  };
  
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Verify Your Account</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="idDocument">Upload Identity Document:</label>
            <input type="file" name="idDocument" onChange={handleIdDocumentChange} required />
          </div>
          <div>
            <label htmlFor="photo">Upload a Photo Holding Your Identity Document:</label>
            <input type="file" name="photo" onChange={handlePhotoChange} required />
          </div>
          <button type="submit">Submit Verification</button>
        </form>
      </div>
    </div>
  );
};

export default VerificationModal;
