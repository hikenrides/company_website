import { Link, Navigate } from "react-router-dom";
import { useContext, useState } from "react";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import { UserContext } from "../UserContext.jsx";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [redirect, setRedirect] = useState(false);
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

  const handleGoogleLogin = async (googleData) => {
    try {
      const { data } = await axios.post("/google-login", {
        tokenId: googleData.tokenId,
      });
      setUser(data);
      alert("Google Login successful");
      setRedirect(true);
    } catch (e) {
      alert("Google Login failed");
    }
  };

  if (redirect) {
    return <Navigate to={"/account/trips"} />;
  }

  return (
    <div className="mt-4 grow flex flex-col items-center justify-around">
      <div className="mb-64">
        <h1 className="text-2xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-3xl text-center mb-4">
          Login
        </h1>
        <form className="max-w-md mx-auto" onSubmit={handleLoginSubmit}>
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
          />
          <div className="password-input">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="password"
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
            />
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
            <label>Show Password</label>
          </div>
          <button className="primary">Login</button>
          <div className="text-center py-2 text-gray-500">
            Don't have an account yet?{" "}
            <Link className="underline text-black" to={"/register"}>
              Register now
            </Link>
          </div>
        </form>
        {/* Google Sign-In Button */}
        <GoogleLogin
          onSuccess={handleGoogleLogin}
          onFailure={(err) => console.error(err)}
          clientId="YOUR_GOOGLE_CLIENT_ID"
          buttonText="Sign in with Google"
        />
      </div>
    </div>
  );
}
