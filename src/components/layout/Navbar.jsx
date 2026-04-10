import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import FoodBankIcon from "@mui/icons-material/FoodBank";
import { Button } from "@mui/material";
import { Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Avatar } from "@mui/material";
import { useAuth } from "../../auth/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { token } = useAuth();
  let pages = [];
  /* If logged in, show all options
   * If not logged in, show minimal options
   */
  token
    ? (pages = [
        { label: "Dashboard", path: "/" },
        { label: "Ingredient Search", path: "ingredients/search" },
        { label: "Daily Log", path: "/daily-log" },
        { label: "Meals", path: "/meals" },
        { label: "Daily Total", path: "daily-totals" },
        { label: "Logout", path: "/logout" },
      ])
    : (pages = [
        { label: "Dashboard", path: "/" },
        { label: "Daily Log", path: "/daily-log" },
        { label: "Meals", path: "/meals" },
        { label: "Login", path: "/login" },
        { label: "Register", path: "/register" },
      ]);

  return (
    <AppBar position="sticky">
      <Toolbar>
        {/* Logo */}
        <FoodBankIcon
          sx={{ display: { xs: "flex", md: "flex" }, mr: "1rem" }}
        />
        {/* App Name */}
        <Typography
          variant="h6"
          noWrap
          component="a"
          href="/"
          sx={{
            mr: "1rem",
            display: { xs: "none", md: "flex" },
            fontFamily: "monospace",
            fontWeight: "medium",
            letterSpacing: ".3rem",
            color: "inherit",
            textDecoration: "none",
          }}
        >
          FEASTLY
        </Typography>
        <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
          {/* Add respective pages to the navbar */}
          {pages.map((page) => (
            <Button
              key={page.label}
              onClick={() => navigate(page.path)}
              sx={{ my: "1rem", color: "white", display: "block" }}
            >
              {page.label}
            </Button>
          ))}
        </Box>
        {/* If the user is logged in, display MUI's default avatar */}
        {token && (
          <Tooltip title="Open account settings">
            <IconButton onClick={() => navigate("/account")} sx={{ p: 0 }}>
              <Avatar />
            </IconButton>
          </Tooltip>
        )}
      </Toolbar>
    </AppBar>
  );
}
