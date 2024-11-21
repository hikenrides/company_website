import React, { useState } from "react";
import axios from "axios";
import { Box, TextField, Button, Typography, Alert } from "@mui/material";

const DriverEarningsPage = () => {
  const [reference, setReference] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setMessage("");
    setError("");

    try {
      const response = await axios.post("/drivers/earnings", { reference });
      setMessage(response.data.message);
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred.");
    }
  };

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg border max-w-2xl mx-auto mt-40">
    <Box sx={{ maxWidth: 600, margin: "0 auto", padding: 3 }}>
      <Typography variant="h5" gutterBottom>
        Driver Earnings
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {message && <Alert severity="success">{message}</Alert>}
      <TextField
        label="Reference Number"
        variant="outlined"
        fullWidth
        value={reference}
        onChange={(e) => setReference(e.target.value)}
        sx={{ marginBottom: 2 }}
      />
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Submit
      </Button>
    </Box>
    </div>
  );
};

export default DriverEarningsPage;
