import { Link, useNavigate, Navigate } from "react-router-dom";
import { useContext, useState } from "react";
import axios from "axios";
import { Button } from "react-bootstrap";
import GoogleButton from '/opt/build/repo/client/node_modules/react-google-button';
import { useUserAuth } from "../UserAuthContext.jsx";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const { logIn, googleSignIn } = useUserAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);




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

  if (redirect) {
    return <Navigate to={"/account/trips"} />;
  }
  

  const handleGoogleSignIn = async (e) => {
    e.preventDefault();
    try {
      await googleSignIn();
      alert("Google sign-in successful");
      navigate("/account/trips");
    } catch (error) {
      alert("Google sign-in failed");
      console.log(error.message);
    }
  };



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
            controlId="formBasicEmail"
          />
          <div className="password-input">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
              className="w-full px-4 py-2 mb-2 border rounded-md"
              controlId="formBasicPassword"
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
          <Link to="/phonesignup">
            <div className="d-grid gap-2 mt-3">
              <Button variant="success" type="Submit">
                Sign in with Phone
              </Button>
            </div>
          </Link>
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
