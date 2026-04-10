import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import FoodBankIcon from "@mui/icons-material/FoodBank";
import { Button } from "@mui/material";
import { Tooltip } from "@mui/material";
import { useNavigate } from "react-router";
import { Avatar } from "@mui/material";

export default function Navbar() {
  const navigate = useNavigate();
  // add token conditionals
  const pages = [
    { label: "Dashboard", path: "/" },
    { label: "Login", path: "/login" },
    { label: "Register", path: "/register" },
    { label: "Logout", path: "/logout" },
  ];
  return (
    <AppBar position="sticky">
      <Toolbar>
        <FoodBankIcon
          sx={{ display: { xs: "flex", md: "flex" }, mr: "1rem" }}
        />
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
          {pages.map((page) => (
            <Button
              key={page.label}
              onClick={() => navigate(`/${page.path}`)}
              sx={{ my: "1rem", color: "white", display: "block" }}
            >
              {page.label}
            </Button>
          ))}
        </Box>
        <Tooltip title="Open account settings">
          <IconButton onClick={() => navigate("/account")} sx={{ p: 0 }}>
            <Avatar />
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
}
