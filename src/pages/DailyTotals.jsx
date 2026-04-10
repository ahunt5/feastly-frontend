import { useEffect, useState } from "react";
import { Box, Typography, Alert, Paper, CircularProgress } from "@mui/material";

// Mock data (replace later with API call)
const MOCK_DAILY_TOTALS = {
  calories: 1850,
  protein: 130,
  carbs: 160,
  fat: 65,
};

/** Displays the user's daily calorie and macro totals as dashboard cards. */
export default function DailyTotals() {
  const [dailyTotals, setDailyTotals] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadDailyTotals();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, []);

  const loadDailyTotals = () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      // Replace this with API call later
      setDailyTotals(MOCK_DAILY_TOTALS);
    } catch (error) {
      console.error("Error loading daily totals:", error);
      setErrorMessage("Could not load daily totals.");
    } finally {
      setIsLoading(false);
    }
  };

  if (errorMessage) {
    return <Alert severity="error">{errorMessage}</Alert>;
  }

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr 1fr",
          sm: "1fr 1fr",
          md: "repeat(4, 1fr)",
        },
        gap: 2,
      }}
    >
      {/* Calories Card */}
      <Paper
        elevation={3}
        sx={{
          p: 2.5,
          borderRadius: 3,
          backgroundColor: "#e3f2fd",
          textAlign: "center",
          transition: "0.2s",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: 6,
          },
        }}
      >
        <Typography variant="subtitle2" color="text.secondary">
          Calories
        </Typography>
        <Typography variant="h5" fontWeight="bold">
          {dailyTotals.calories}
        </Typography>
      </Paper>

      {/* Protein Card */}
      <Paper
        elevation={3}
        sx={{
          p: 2.5,
          borderRadius: 3,
          backgroundColor: "#e8f5e9",
          textAlign: "center",
          transition: "0.2s",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: 6,
          },
        }}
      >
        <Typography variant="subtitle2" color="text.secondary">
          Protein
        </Typography>
        <Typography variant="h5" fontWeight="bold">
          {dailyTotals.protein}g
        </Typography>
      </Paper>

      {/* Carbs Card */}
      <Paper
        elevation={3}
        sx={{
          p: 2.5,
          borderRadius: 3,
          backgroundColor: "#fff3e0",
          textAlign: "center",
          transition: "0.2s",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: 6,
          },
        }}
      >
        <Typography variant="subtitle2" color="text.secondary">
          Carbs
        </Typography>
        <Typography variant="h5" fontWeight="bold">
          {dailyTotals.carbs}g
        </Typography>
      </Paper>

      {/* Fat Card */}
      <Paper
        elevation={3}
        sx={{
          p: 2.5,
          borderRadius: 3,
          backgroundColor: "#fce4ec",
          textAlign: "center",
          transition: "0.2s",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: 6,
          },
        }}
      >
        <Typography variant="subtitle2" color="text.secondary">
          Fat
        </Typography>
        <Typography variant="h5" fontWeight="bold">
          {dailyTotals.fat}g
        </Typography>
      </Paper>
    </Box>
  );
}
