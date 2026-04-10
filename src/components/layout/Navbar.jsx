import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import { Menu, MenuItem } from "@mui/material";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import FoodBankIcon from "@mui/icons-material/FoodBank";
import { Button } from "@mui/material";
import { Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Avatar } from "@mui/material";
import { useAuth } from "../../auth/AuthContext";
import { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";

export default function Navbar() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  /* If logged in, show all options
   * If not logged in, show minimal options
   */
  const pages = token
    ? [
        { label: "Dashboard", path: "/" },
        { label: "Ingredient Search", path: "ingredients/search" },
        { label: "Daily Log", path: "/daily-log" },
        { label: "Meals", path: "/meals" },
        { label: "Daily Total", path: "daily-totals" },
        { label: "Logout", path: "/logout" },
      ]
    : [
        { label: "Dashboard", path: "/" },
        { label: "Daily Log", path: "/daily-log" },
        { label: "Meals", path: "/meals" },
        { label: "Login", path: "/login" },
        { label: "Register", path: "/register" },
      ];

  return (
    <AppBar position="sticky">
      <Toolbar>
        {/* Small screen support */}
        <IconButton
          size="large"
          color="inherit"
          onClick={handleOpen}
          sx={{ display: { xs: "flex", md: "none" } }}
        >
          <MenuIcon />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          sx={{ display: { xs: "block", md: "none" } }}
        >
          {pages.map((page) => (
            <MenuItem
              key={page.label}
              onClick={() => {
                navigate(page.path);
                handleClose();
              }}
            >
              {page.label}
            </MenuItem>
          ))}
        </Menu>
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
            display: { xs: "flex", md: "flex" },
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
              onClick={() => navigate(page.path)}
              sx={{ my: "1rem", color: "white", display: "block" }}
            >
              {page.label}
            </Button>
          ))}
        </Box>
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
