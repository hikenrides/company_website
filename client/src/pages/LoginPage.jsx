import React, { useContext, useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { UserContext } from "../UserContext.jsx";
import { Navigate, Link as RouterLink } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Button,
  Container,
  CssBaseline,
  TextField,
  Typography,
  Divider,
  Link,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const { setUser } = useContext(UserContext);
  const [errorMessage, setErrorMessage] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const googleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        const { data } = await axios.get(`/auth/google/callback?token=${response.credential}`);
        if (data.token) {
          localStorage.setItem("token", data.token);
          const profileResponse = await axios.get("/profile", {
            headers: { Authorization: `Bearer ${data.token}` },
          });
          setUser(profileResponse.data);
          setRedirect(true);
        } else {
          setErrorMessage("Google login failed.");
        }
      } catch {
        setErrorMessage("Google login failed.");
      }
    },
    onError: () => setErrorMessage("Google login failed."),
  });

  async function handleLoginSubmit(ev) {
    ev.preventDefault();
    try {
      const { data, status } = await axios.post("/login", { email, password });
      if (status === 200 && data.token) {
        localStorage.setItem("token", data.token);
        const profileResponse = await axios.get("/profile", {
          headers: { Authorization: `Bearer ${data.token}` },
        });
        setUser(profileResponse.data);
        setRedirect(true);
      } else {
        setErrorMessage("Invalid credentials.");
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.error || "Login failed.");
    }
  }

  if (redirect) return <Navigate to={"/account/trips"} />;

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 50,
      }}
    >
      <Container maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            backgroundColor: "white",
            p: 4,
            borderRadius: 2,
            position: "relative",
            boxShadow: 3,
          }}
        >
          <IconButton
            sx={{ position: "absolute", top: 8, right: 8 }}
            onClick={() => setRedirect(true)}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h5" textAlign="center" fontWeight="bold" mb={2}>
            Login to your account
          </Typography>

          <Box display="flex" flexDirection="column" gap={2}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => googleLogin()}
              sx={{ textTransform: "none" }}
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                style={{ height: 18, marginRight: 8 }}
              />
              Continue with Google
            </Button>
          </Box>

          <Divider sx={{ my: 3 }}>OR</Divider>

          <form onSubmit={handleLoginSubmit}>
            <TextField
              fullWidth
              margin="normal"
              required
              label="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              fullWidth
              margin="normal"
              required
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errorMessage && (
              <Typography color="error" variant="body2" mt={1}>
                {errorMessage}
              </Typography>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 2, textTransform: "none" }}
            >
              Continue
            </Button>
          </form>

          <Typography variant="body2" align="center" mt={3}>
            <Link component={RouterLink} to="/forgot-password">
              Reset your password?
            </Link>
          </Typography>

          <Typography variant="body2" align="center" mt={2}>
            Don't have an account?{" "}
            <Link component={RouterLink} to="/register" color="primary">
              Sign up
            </Link>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}


