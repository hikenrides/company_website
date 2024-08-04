import React, { useContext, useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { UserContext } from "../UserContext.jsx";
import axios from 'axios';
import { Navigate, Link as RouterLink } from "react-router-dom";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Link from '@mui/material/Link';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

const defaultTheme = createTheme();

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const { setUser } = useContext(UserContext);
  const [errorMessage, setErrorMessage] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  async function handleLoginSubmit(ev) {
    ev.preventDefault();
    try {
      const { data, status } = await axios.post("/login", { email, password });
      if (status === 200 && data && data.token) {
        localStorage.setItem('token', data.token);
        const profileResponse = await axios.get('/profile', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setUser(profileResponse.data);
        alert("Login successful");
        setRedirect(true);
      } else {
        setErrorMessage("Invalid credentials");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.error || "Login failed: Invalid credentials");
      } else {
        setErrorMessage("Login failed: Invalid credentials");
      }
    }
  }

  const handleGoogleSuccess = async (response) => {
    try {
      const { credential } = response;
      // Call the backend to verify the Google token
      const { data } = await axios.get(`/auth/google/callback?token=${credential}`);
      
      // Save the token and user data to local storage and context
      localStorage.setItem('token', data.token);
      setUser(data);
      setRedirect(true);
    } catch (error) {
      setErrorMessage("Google login failed");
    }
  };
  
  
  const handleGoogleFailure = () => {
    setErrorMessage("Google login failed");
  };
  

  if (redirect) {
    return <Navigate to={"/account/trips"} />;
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: isMobile ? 2 : 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: 10,
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          <Box component="form" onSubmit={handleLoginSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
            />
            <FormControlLabel
              control={
                <Checkbox 
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)} 
                  color="primary" 
                />
              }
              label="Show Password"
            />
            {errorMessage && (
              <Typography variant="body2" color="red" align="center">
                {errorMessage}
              </Typography>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onFailure={handleGoogleFailure}
                buttonText="Sign in with Google"
                cookiePolicy="single_host_origin"
              />
            </GoogleOAuthProvider>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link component={RouterLink} to="/register" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
