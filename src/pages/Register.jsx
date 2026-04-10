import { useState } from "react";
import { useAuth } from "../auth/AuthContext.jsx";
import { Box, Typography, TextField, Button, Alert } from "@mui/material";
import { useNavigate } from "react-router";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);

  // Send API request to backend for registering, if successful navigate to dashboard
  const tryRegister = async (event, formData) => {
    event.preventDefault();
    setError(null);

    const email = formData.email;
    const password = formData.password;
    try {
      await register({ email, password });
      navigate("/");
    } catch (e) {
      // If fail, set an error and display it to the user on the register page
      setError(e.message);
    }
  };
  return (
    // Page container
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          maxWidth: "30rem",
          gap: "1rem",
          px: "1rem",
        }}
      >
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0, mb: 0 }}>
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              maxWidth: "30rem",
              gap: "1rem",
              px: "1rem",
              alignItems: "center",
            }}
          >
            Create an account
          </Typography>
        </Box>

        {/* Show errors */}
        {error && <Alert severity="error">{error}</Alert>}

        {/* Form */}
        <Box
          component="form"
          sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <TextField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            required
            fullWidth
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, password: e.target.value }))
            }
            required
            fullWidth
          />
          {/* Register submission button */}
          <Button
            type="button"
            variant="contained"
            fullWidth
            size="large"
            onClick={(e) => tryRegister(e, formData)}
          >
            Register
          </Button>
          {/* Login button */}
          <Button variant="text" fullWidth onClick={() => navigate("/login")}>
            Have an account? Click here to login.
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
