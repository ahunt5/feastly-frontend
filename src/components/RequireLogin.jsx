import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router";

export default function RequireLogin() {
  const navigate = useNavigate();
  return (
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
          gap: 2,
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          You need to be logged in to use this feature.
        </Typography>
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
