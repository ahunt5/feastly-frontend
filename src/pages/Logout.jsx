import { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext.jsx";
import { Box, Typography, CircularProgress } from "@mui/material";
import { Link, useNavigate } from "react-router";
import { LinearProgress } from "@mui/material";
/* Logout page
This page was added because our design agreed upon a logout page
It consists of a timer after logging out
When the timer hits 0, redirect the user to the homepage
*/
export default function LogoutPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const TOTALTIME = 3;
  const [countdown, setCountdown] = useState(TOTALTIME);
  const progress = ((TOTALTIME - countdown) / TOTALTIME) * 100;
  // logout immediately
  logout();
  // Start timer for redirect to home page
  useEffect(() => {
    if (countdown === 0) {
      navigate("/");
    }
    const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, navigate]);

  return (
    // Page container
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "60vh",
        gap: "1rem",
      }}
    >
      <Typography variant="h4" fontWeight="bold">
        You've been logged out
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Redirecting you to logout in...
      </Typography>
      <Typography variant="h1" color="primary" fontWeight="bold">
        {countdown}
      </Typography>
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{ width: "20rem", height: "1rem", borderRadius: "1rem" }}
      />
      <Typography>
        <Link to="/">If you are not redirected, please click here.</Link>
      </Typography>
    </Box>
  );
}
