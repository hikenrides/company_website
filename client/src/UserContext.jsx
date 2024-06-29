import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(null); // New state to handle errors

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve token from localStorage
        if (!token) {
          throw new Error('No token stored');
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const { data } = await axios.get('/profile', config);
        setUser(data);
        setReady(true);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setError(error.message); // Set the error state
      }
    };

    fetchUserProfile();
  }, []);

  if (error) {
    // Handle the case where there's an error (e.g., redirect to login)
    // For now, we'll render a message to indicate the issue
    return <div>Error: {error}</div>;
  }

  return (
    <UserContext.Provider value={{ user, setUser, ready }}>
      {children}
    </UserContext.Provider>
  );
}
