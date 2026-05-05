import { useEffect, useState } from "react";
import { Box, Typography, Alert, Paper, CircularProgress } from "@mui/material";
import { useAuth } from "../auth/AuthContext";

const API = import.meta.env.VITE_API || "/api";

const EMPTY_TOTALS = {
  calories: 0,
  protein: 0,
  carbs: 0,
  fat: 0,
};

async function parseResponse(response) {
  const text = await response.text();

  if (!text) return {};

  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

function normalizeDailyTotals(data) {
  return {
    calories: data?.total_calories ?? data?.calories ?? 0,
    protein: data?.total_protein ?? data?.protein ?? 0,
    carbs: data?.total_carbs ?? data?.carbs ?? 0,
    fat: data?.total_fat ?? data?.fat ?? 0,
  };
}

async function fetchTodayTotals(token) {
  const response = await fetch(`${API}/dailyTotals/me/today`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(data?.message || data?.error || "Could not load totals.");
  }

  return normalizeDailyTotals(data);
}

function TotalCard({ label, value, suffix = "", backgroundColor }) {
  return (
    <Paper
      elevation={3}
      sx={{
        p: 2.5,
        borderRadius: 3,
        backgroundColor,
        textAlign: "center",
        transition: "0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 6,
        },
      }}
    >
      <Typography variant="subtitle2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="h5" fontWeight="bold">
        {Math.round(value)}
        {suffix}
      </Typography>
    </Paper>
  );
}

/** Displays the user's real daily calorie and macro totals from the backend. */
export default function DailyTotals({ refreshKey = 0 }) {
  const { token } = useAuth();
  const [dailyTotals, setDailyTotals] = useState(EMPTY_TOTALS);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadDailyTotals() {
      if (!token) {
        setDailyTotals(EMPTY_TOTALS);
        setErrorMessage("You must be logged in to view daily totals.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setErrorMessage("");
        const totals = await fetchTodayTotals(token);

        if (!ignore) {
          setDailyTotals(totals);
        }
      } catch (error) {
        if (!ignore) {
          setErrorMessage(error.message || "Could not load daily totals.");
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadDailyTotals();

    return () => {
      ignore = true;
    };
  }, [token, refreshKey]);

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
      <TotalCard
        label="Calories"
        value={dailyTotals.calories}
        backgroundColor="#e3f2fd"
      />
      <TotalCard
        label="Protein"
        value={dailyTotals.protein}
        suffix="g"
        backgroundColor="#e8f5e9"
      />
      <TotalCard
        label="Carbs"
        value={dailyTotals.carbs}
        suffix="g"
        backgroundColor="#fff3e0"
      />
      <TotalCard
        label="Fat"
        value={dailyTotals.fat}
        suffix="g"
        backgroundColor="#fce4ec"
      />
    </Box>
  );
}
