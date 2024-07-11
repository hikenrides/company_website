import React from 'react';
import Footer from './footer';

const Security = () => {
  return (
    <div className="security">
      <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 'bold', color: '#333', fontFamily: 'Verdana' }}>Security</h2>
      <p style={{ color: '#333', fontFamily: 'Verdana' }}>At Hikenrides, we prioritize the safety and security of our users. Here are some of the measures we take to ensure a secure experience:</p>
      
      <h3 style={{ marginBottom: '1.5rem', marginTop: '1.5rem', fontSize: '1.5rem', fontWeight: 'bold', color: '#333', fontFamily: 'Verdana'}}>User Verification</h3>
      <p style={{ color: '#333', fontFamily: 'Verdana' }}>All users undergo stringent verification processes. We verify identities and ensure only legitimate individuals join our platform.</p>
      
      <h3 style={{ marginBottom: '1.5rem', marginTop: '1.5rem', fontSize: '1.5rem', fontWeight: 'bold', color: '#333', fontFamily: 'Verdana'}}>Document Verification</h3>
      <p style={{ color: '#333', fontFamily: 'Verdana' }}>We require users to upload and verify legitimate documents such as driver's licenses and identification cards. This ensures that only verified drivers and passengers can request or offer rides.</p>
      
      <h3 style={{ marginBottom: '1.5rem', marginTop: '1.5rem', fontSize: '1.5rem', fontWeight: 'bold', color: '#333', fontFamily: 'Verdana'}}>Data Encryption</h3>
      <p style={{ color: '#333', fontFamily: 'Verdana' }}>We use industry-standard encryption methods to protect your personal and financial information.</p>
      
      <h3 style={{ marginBottom: '1.5rem', marginTop: '1.5rem', fontSize: '1.5rem', fontWeight: 'bold', color: '#333', fontFamily: 'Verdana'}}>Secure Payment Processing</h3>
      <p style={{ color: '#333', fontFamily: 'Verdana' }}>Transactions on our platform are securely processed to safeguard your financial details.</p>
      
      <h3 style={{ marginBottom: '1.5rem', marginTop: '1.5rem', fontSize: '1.5rem', fontWeight: 'bold', color: '#333', fontFamily: 'Verdana'}}>Community Guidelines</h3>
      <p style={{ color: '#333', fontFamily: 'Verdana' }}>We have clear community guidelines that all users must follow to maintain a safe and respectful environment.</p>
      
      <h3 style={{ marginBottom: '1.5rem', marginTop: '1.5rem', fontSize: '1.5rem', fontWeight: 'bold', color: '#333', fontFamily: 'Verdana'}}>24/7 Customer Support</h3>
      <p style={{ color: '#333', fontFamily: 'Verdana' }}>Our dedicated support team is available around the clock to assist with any security-related concerns or issues.</p>
      
      <p style={{ color: '#333', fontFamily: 'Verdana' }}>For more information on our security policies and practices, please refer to our Terms and Conditions or contact our support team.</p>
      <div className='mt-20'>
        <Footer />
      </div>
    </div>
  );
};

export default Security;
