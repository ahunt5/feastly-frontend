import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router";

export default function Error404() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        gap: "1rem",
        px: "1rem",
        textAlign: "center",
      }}
    >
      <Typography variant="h1" fontWeight="bold">
        404 Error
      </Typography>
      <Typography variant="h5" fontWeight="bold">
        The page you are looking for doesn't exist. It may have been moved,
        renamed, or is no longer available.
      </Typography>
      <Button
        variant="contained"
        size="large"
        color="primary"
        onClick={() => navigate("/")}
      >
        Go Home
      </Button>
    </Box>
  );
}
