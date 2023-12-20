import React from 'react';
import { Link } from 'react-router-dom';
import './TermsAndConditions.css'; // Import your CSS file

const TermsAndConditions = () => {
  return (
    <div className="terms-container">
      <h1 className="terms-header">Terms and Conditions</h1>
      <div className="terms-content">
        <p>
          <strong>1. Acceptance of Terms</strong><br />
          By accessing or using https://hikenrides.com website, you agree to comply with and be bound by these terms and conditions.
          If you do not agree to these terms, please do not use the Service.
        </p>

        <p>
          <strong>2. User Registration</strong><br />
          To use certain features of the Service, you may be required to register for an account. When registering, you agree to provide accurate and complete information.
        </p>

        <p>
          <strong>3. Privacy Policy</strong><br />
          Your use of the Service is also governed by our Privacy Policy. Please review our Privacy Policy to understand our practices.
        </p>

        <p>
          <strong>4. User Responsibilities</strong><br />
          You are responsible for maintaining the confidentiality of your account and password. You agree to notify us immediately of any unauthorized use of your account.
        </p>

        <p>
          <strong>5. Prohibited Conduct</strong><br />
          You agree not to engage in any conduct that may violate these terms and conditions, the law, or the rights of others.
        </p>

        <p>
          <strong>6. Termination</strong><br />
          We reserve the right to terminate or suspend your account and access to the Service at our sole discretion, without notice.
        </p>

        <p>
          <strong>7. Changes to Terms</strong><br />
          We may update or modify these terms and conditions at any time without prior notice. Continued use of the Service after such changes constitutes your consent to the changes.
        </p>

        <p>
          <strong>8. Governing Law</strong><br />
          These terms and conditions are governed by and construed in accordance with the laws of South Africa.
        </p>
      </div>
      <div className="back-link">
        <Link to="/register">Back to Registration</Link>
      </div>
    </div>
  );
};

export default TermsAndConditions;
