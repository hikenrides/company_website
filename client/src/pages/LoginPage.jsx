import React, { useContext, useState, useEffect } from "react";
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

  useEffect(() => {
    // Load the Google Platform Library and render the button
    const script = document.createElement('script');
    script.src = "https://apis.google.com/js/platform.js";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      window.gapi.load('auth2', () => {
        window.gapi.auth2.init({
          client_id: '300890038465-pim80rkka1tn10ro5h80g4ncctmqeg4u.apps.googleusercontent.com',
        }).then(() => {
          renderButton();
        });
      });
    };
    document.body.appendChild(script);
  }, []);

  const renderButton = () => {
    window.gapi.signin2.render('my-signin2', {
      'scope': 'profile email',
      'width': 240,
      'height': 50,
      'longtitle': true,
      'theme': 'dark',
      'onsuccess': handleGoogleSuccess,
      'onfailure': handleGoogleFailure
    });
  };

  const handleGoogleSuccess = async (googleUser) => {
    try {
      const id_token = googleUser.getAuthResponse().id_token;
      const { data } = await axios.get(`/auth/google/callback?token=${id_token}`);
      
      const token = data.token;
  
      if (token) {
        localStorage.setItem('token', token);
        const profileResponse = await axios.get('/profile', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setUser(profileResponse.data);
        setRedirect(true);
      } else {
        setErrorMessage("Google login failed: No token provided");
      }
    } catch (error) {
      setErrorMessage("Invalid Email");
    }
  };

  const handleGoogleFailure = (error) => {
    setErrorMessage("Google login failed");
    console.error(error);
  };

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
            marginBottom: isMobile ? 2 : 10,
            padding: isMobile ? 2 : 4,
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant={isMobile ? "h6" : "h5"}>
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
              InputLabelProps={{ style: { fontSize: isMobile ? 14 : 16 } }}
              InputProps={{ style: { fontSize: isMobile ? 14 : 16 } }}
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
              InputLabelProps={{ style: { fontSize: isMobile ? 14 : 16 } }}
              InputProps={{ style: { fontSize: isMobile ? 14 : 16 } }}
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
              sx={{ mt: 3, mb: 2, fontSize: isMobile ? 14 : 16 }}
            >
              Sign In
            </Button>
            <Box
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mb: 2, fontSize: isMobile ? 14 : 16 }}
            >
              <div id="my-signin2"></div>
            </Box>
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
