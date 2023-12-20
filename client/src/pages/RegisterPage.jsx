import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import './TermsAndConditions.css';

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [phone_number, setNumber] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [isDriver, setIsDriver] = useState("");
  const [driverLicense, setDriverLicense] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const isDriverValue = isDriver === 'Yes';

  const validateEmail = (inputEmail) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(inputEmail);
  };

  async function registerUser(ev) {
    ev.preventDefault();
    if (password !== confirmPassword) {
      setPasswordError(true);
      return;
    }
    if (!validateEmail(email)) {
      alert("Please enter a valid email address");
      return;
    }
    if (!agreeTerms) {
      alert("Please agree to the terms and conditions");
      return;
    }
    try {
      await axios.post("/register", {
        name,
        gender,
        phone_number,
        age,
        email,
        isDriver: isDriverValue,
        driverLicense: isDriver === "Yes" ? driverLicense : "",
        password,
      });
      alert("Registration successful. Now you can log in");
    } catch (e) {
      console.log("Registration failed. Please try again later");
    }
  }

  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-64">
        <h1 className="text-2xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-3xl text-center mb-4">Register</h1>
        <form className="max-w-md mx-auto" onSubmit={registerUser}>
          <input
            type="text"
            placeholder="Names and Surname"
            value={name}
            onChange={(ev) => setName(ev.target.value)}
          />
          <select
            value={gender}
            onChange={(ev) => setGender(ev.target.value)}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <input
            type="text"
            placeholder="Phone number"
            value={phone_number}
            onChange={(ev) => setNumber(ev.target.value)}
          />
          <input
            type="text"
            placeholder="Age"
            value={age}
            onChange={(ev) => setAge(ev.target.value.slice(0, 3))}
          />
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
          />
          <select
            value={isDriver}
            onChange={(ev) => setIsDriver(ev.target.value)}
          >
            <option value="">Are you a driver?</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
          {isDriver === "Yes" && (
            <>
              <input
                type="text"
                placeholder="Driver's License No"
                value={driverLicense}
                onChange={(ev) => setDriverLicense(ev.target.value)}
              />
            </>
          )}

<div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
            />
            <button className="eye-icon" onClick={togglePasswordVisibility}>
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(ev) => setConfirmPassword(ev.target.value)}
          />

          <div className="terms-checkbox">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={() => setAgreeTerms(!agreeTerms)}
            />
            <label className="back-link2">
              I agree to the <Link to="/Terms and Conditions" target="_blank">Terms and Conditions</Link>
            </label>
          </div>

          <button className="primary">Register</button>
          <div className="text-center py-2 text-gray-500">
            Already a member? <Link className="underline text-black" to={"/login"}>Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
}