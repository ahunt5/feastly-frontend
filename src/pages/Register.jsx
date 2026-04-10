import { useState } from "react";
import { useAuth } from "../auth/AuthContext.jsx";
import { Box, Typography, TextField, Button, Alert } from "@mui/material";
import { useNavigate } from "react-router";

/** A form that allows users to log into an existing account. */
export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);

  const tryRegister = async (event, formData) => {
    event.preventDefault();
    setError(null);

    const email = formData.email;
    const password = formData.password;
    try {
      await register({ email, password });
      navigate("/");
    } catch (e) {
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
          <Button
            type="button"
            variant="contained"
            fullWidth
            size="large"
            onClick={(e) => tryRegister(e, formData)}
          >
            Register
          </Button>
          <Button variant="text" fullWidth onClick={() => navigate("/login")}>
            Have an account? Click here to login.
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
