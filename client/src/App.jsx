import './App.css'
import IndexPage from "./pages/IndexPage.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Layout from "./Layout";
import RegisterPage from "./pages/RegisterPage";
import axios from "axios";
import { UserContextProvider } from "./UserContext.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import PlacesPage from "./pages/PlacesPage";
import PlacesFormPage from "./pages/PlacesFormPage";
import PlacePage from "./pages/PlacePage";
import BookingsPage from "./pages/BookingsPage";
import BookingPage from "./pages/BookingPage";
import TripRequest from "./pages/TripRequest";
import RequestsPage from "./pages/RequestsPage";
import TripOfferPage from "./pages/TripOfferPage";
import RequestOfferPage from "./pages/RequestOfferPage";
import BookingPage2 from "./pages/BookingPage2";
import PageRequest from "./pages/PageRequest";

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
axios.defaults.withCredentials = true;

function App() {
  return (
    <GoogleOAuthProvider clientId="422449315657-5j14kdrc469jn276gioblbirmu2n65tu.apps.googleusercontent.com">
      <UserContextProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<IndexPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/account" element={<ProfilePage />} />
              <Route path="/account/places" element={<PlacesPage />} />
              <Route path="/account/places/new" element={<PlacesFormPage />} />
              <Route path="/account/Myrequests/new" element={<TripRequest />} />
              <Route path="/account/Myrequests" element={<RequestsPage />} />
              <Route path="/account/places/:id" element={<PlacesFormPage />} />
              <Route path="/place/:id" element={<PlacePage />} />
              <Route path="/request/:id" element={<PageRequest />} />
              <Route path="/account/bookings" element={<BookingsPage />} />
              <Route path="/account/bookings/:id" element={<BookingPage />} />
              <Route
                path="/account/bookings../:id"
                element={<BookingPage2 />}
              />
              <Route path="/account/trips" element={<TripOfferPage />} />
              <Route path="/account/requests" element={<RequestOfferPage />} />
            </Route>
          </Routes>
        </Router>
      </UserContextProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
