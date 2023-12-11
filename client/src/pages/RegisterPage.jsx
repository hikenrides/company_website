import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useUserAuth } from "../UserAuthContext";

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
  const [profilePicture, setProfilePicture] = useState(null);
  const [error, setError] = useState("");
  const { signUp } = useUserAuth();
  let navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signUp(email, password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
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
      // You should implement the logic for handling the profile picture upload here
      const formData = new FormData();
      formData.append("profilePicture", profilePicture);
      
      // This is just a placeholder URL, replace it with your actual API endpoint for file upload
      const fileUploadResponse = await axios.post("/upload-profile-picture", formData);

      await axios.post("/register", {
        name,
        gender,
        phone_number,
        age,
        email,
        isDriver: isDriverValue,
        driverLicense: isDriver === "Yes" ? driverLicense : "",
        password,
        profilePictureUrl: fileUploadResponse.data.url, // Assuming your server returns the URL of the uploaded image
      });

      alert("Registration successful. Now you can log in");
    } catch (e) {
      console.log("Registration failed. Please try again later");
    }
  }
  const handleFormSubmit = (ev) => {
    ev.preventDefault();
    // Call both registerUser and handleSubmit
    registerUser(ev);
    handleSubmit(ev);
  };

  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-64">
        <h1 className="text-2xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-3xl text-center mb-4">Register</h1>
        <form className="max-w-md mx-auto" onSubmit={(ev) => handleFormSubmit(ev)}>
          <input
            type="text"
            placeholder="Names and Surname"
            value={name}
            onChange={(ev) => setName(ev.target.value)}
          />
          <div className="flex mb-4">
            <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-700">
              Profile Picture
            </label>
            <input
              type="file"
              id="profilePicture"
              accept="image/*"
              onChange={(e) => setProfilePicture(e.target.files[0])}
            />
          </div>
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
            placeholder="Email address"
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

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
          />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(ev) => setConfirmPassword(ev.target.value)}
          />
          {passwordError && <p>Passwords do not match</p>}
          <div>
            <input
              type="checkbox"
              checked={showPassword}
              onChange={togglePasswordVisibility}
            />
            <label>Show Password</label>
          </div>

          <div className="terms-checkbox">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={() => setAgreeTerms(!agreeTerms)}
            />
            <label>
              I agree to the <Link to="/terms" target="_blank">Terms and Conditions</Link>
            </label>
          </div>
          

          <Button className="primary" type="submit">Sign up</Button>
          <div className="text-center py-2 text-gray-500">
            Already a member? <Link className="underline text-black" to={"/login"}>Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
