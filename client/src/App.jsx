import React from 'react';
import './App.css';
import { Route, Routes } from "react-router-dom";
import axios from "axios";
import { UserContextProvider } from "./UserContext.jsx";
import IndexPage from "./pages/IndexPage.jsx";
import LoginPage from "./pages/LoginPage";
import Layout from "./Layout";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage.jsx";
import PlacesPage from "./pages/PlacesPage";
import PlacesFormPage from "./pages/PlacesFormPage";
import PlacePage from "./pages/PlacePage";
import BookingsPage from "./pages/BookingsPage";
import BookingPage from "./pages/BookingPage";
import TripRequest from "./pages/TripRequest";
import RequestsPage from './pages/RequestsPage';
import TripOfferPage from './pages/TripOfferPage';
import RequestOfferPage from './pages/RequestOfferPage';
import BookingPage2 from './pages/BookingPage2';
import PageRequest from './pages/PageRequest';
import TermsAndConditions from "./pages/TermsPage.jsx";
import DepositPage from "./pages/DepositPage.jsx";
import WithdrawPage from "./pages/WithdrawPage.jsx";
import WithdrawForm from "./pages/WithdrawForm.jsx";
import VerificationPage from './pages/VerificationPage.jsx';

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
axios.defaults.withCredentials = true;

function App() {
  // Function to get JWT token from storage (localStorage or cookies)
  const getAuthToken = () => {
    return localStorage.getItem('accessToken'); // Adjust this according to your token storage method
  };

  // Axios request interceptor to add JWT token to headers
  axios.interceptors.request.use(
    config => {
      const token = getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );

  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/account" element={<ProfilePage />} />
          <Route path="/account/Mytrips" element={<PlacesPage />} />
          <Route path="/account/Mytrips/new" element={<PlacesFormPage />} />
          <Route path="/account/Myrequests/new" element={<TripRequest />} />
          <Route path="/account/Myrequests" element={<RequestsPage />} />
          <Route path="/account/trips/:id" element={<PlacesFormPage />} />
          <Route path="/trip/:id" element={<PlacePage />} />
          <Route path="/request/:id" element={<PageRequest />} />
          <Route path="/account/bookings" element={<BookingsPage />} />
          <Route path="/account/bookings/:id" element={<BookingPage />} />
          <Route path="/account/bookings../:id" element={<BookingPage2 />} />
          <Route path="/account/trips" element={<TripOfferPage />} />
          <Route path="/account/requests" element={<RequestOfferPage />} />
          <Route path="/Terms and Conditions" element={<TermsAndConditions />} />
          <Route path="/deposit" element={<DepositPage />} />
          <Route path="/withdraw" element={<WithdrawPage />} />
          <Route path="/WithdrawalForm" element={<WithdrawForm />} />
          <Route path="/verification" element={<VerificationPage />} />
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
