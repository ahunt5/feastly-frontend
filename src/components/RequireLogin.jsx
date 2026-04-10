import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router";

export default function RequireLogin() {
  /*
  Display this component if the user is not logged in
  On a page that requires a login
  */
  const navigate = useNavigate();
  return (
    // Page container
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        {/* Login required message */}
        <Typography variant="h5" fontWeight="bold">
          You need to be logged in to use this feature.
        </Typography>
        {/* Buttons for login and registering */}
        <Box sx={{ display: "flex", gap: "1rem" }}>
          <Button variant="contained" onClick={() => navigate("/login")}>
            Log In
          </Button>
          <Button variant="outlined" onClick={() => navigate("/register")}>
            Sign Up
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
