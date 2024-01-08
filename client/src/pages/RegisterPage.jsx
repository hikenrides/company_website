import { Link, useNavigate } from "react-router-dom";
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
  const [balance, setBalance] = useState(0);
  const navigate = useNavigate();

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
        balance
      });
      alert("Registration successful. Now you can log in");
      navigate("/login");
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

<div className="password-field relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
            />
            <button className="eye-icon absolute right-0 top-0 m-2" onClick={togglePasswordVisibility}>
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" height="16" width="20" viewBox="0 0 640 512">
                <path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z"/>
              </svg>
              ) : (
                
                <svg xmlns="http://www.w3.org/2000/svg" height="16" width="18" viewBox="0 0 576 512">
                <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"/>
              </svg>
              )}
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