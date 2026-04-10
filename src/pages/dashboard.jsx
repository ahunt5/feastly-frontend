import { Box, Paper, Typography, Divider } from "@mui/material";
import DailyTotals from "./DailyTotals";
import DailyLogPage from "./DailyLogPage";

export default function Dashboard() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        maxWidth: "1400px",
        mx: "auto",
        px: { xs: 2, sm: 3, md: 4 },
        pt: 10,
        pb: 4,
        backgroundColor: "#f8f9fb",
      }}
    >
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">
          Dashboard
        </Typography>
        <Typography color="text.secondary">
          Track your meals and monitor your nutrition in one place.
        </Typography>
      </Box>

      <Paper
        elevation={2}
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: 3,
          mb: 3,
        }}
      >
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
          Daily Totals
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Your nutrition summary for today.
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <DailyTotals />
      </Paper>

      <Paper
        elevation={2}
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: 3,
        }}
      >
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
          Daily Log
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Plan and manage your meals for the week.
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <DailyLogPage />
      </Paper>
    </Box>
  );
}
