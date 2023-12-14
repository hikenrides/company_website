import { Link, useNavigate, Navigate } from "react-router-dom";
import { useContext, useState } from "react";
import axios from "axios";
import { Button } from "react-bootstrap";
import GoogleButton from '/opt/build/repo/client/node_modules/react-google-button';
import { useUserAuth, UserContext } from "../UserAuthContext.jsx";



export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const { logIn, googleSignIn } = useUserAuth();
  const navigate = useNavigate(); 

  const { setUser } = useContext(UserContext);

  async function handleLoginSubmit(ev) {
    ev.preventDefault();
    try {
      const { data } = await axios.post("/login", { email, password });
      setUser(data);
      alert("Login successful");
      setRedirect(true);
    } catch (e) {
      alert("Login failed");
    }
  }

  const handleGoogleSignIn = async (e) => {
    e.preventDefault();
    try {
      // Sign in with Google
      const { user } = await googleSignIn();
  
      // Fetch additional user data from the database
      const { data: userData } = await axios.get(`/profile`);
  
      // Update the user information in the context
      setUser(userData);
  
      // Navigate to the desired page
      navigate("/account/trips");
  
      // Display a success message
      alert("Google SignIn successful");
    } catch (error) {
      console.log(error.message);
      alert("Google sign-in failed");
    }
  };
  
  

  if (redirect) {
    return <Navigate to={"/account/trips"} />;
  }
  return (
    <div className="mt-4 grow flex flex-col items-center justify-around">
      <div className="mb-64">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-3xl text-center mb-4">
          Login
        </h1>
        <form className="max-w-md mx-auto" onSubmit={handleLoginSubmit}>
          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
            className="w-full px-4 py-2 mb-2 border rounded-md"
          />
          <div className="password-input">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
              className="w-full px-4 py-2 mb-2 border rounded-md"
            />
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
            <label>Show Password</label>
          </div>
          <button className="primary w-full px-4 py-2 mb-2 border rounded-md">Login</button>
          <div className="d-flex justify-center mb-2">
            <GoogleButton
              className="g-btn"
              type="dark"
              onClick={handleGoogleSignIn}
            />
          </div>
          <div className="text-center py-2 text-gray-500">
            Don't have an account yet?{" "}
            <Link className="underline text-black" to={"/register"}>
              Register now
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
