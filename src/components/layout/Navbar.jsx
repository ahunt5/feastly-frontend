import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import { Menu, MenuItem, Button, Tooltip, Avatar } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router";
import { useAuth } from "../../auth/AuthContext";
import { useState } from "react";
const logo = "/feastly_logo1.png";

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
        { label: "Ingredient Search", path: "/ingredients/search" },
        { label: "Meals", path: "/meals" },
        { label: "Logout", path: "/logout" },
      ]
    : [
        { label: "Dashboard", path: "/" },
        { label: "Meals", path: "/meals" },
        { label: "Login", path: "/login" },
        { label: "Register", path: "/register" },
      ];

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: "#1976d2",
        boxShadow: 2,
      }}
    >
      <Toolbar sx={{ minHeight: "72px" }}>
        {/* Small screen support */}
        <IconButton
          size="large"
          color="inherit"
          onClick={handleOpen}
          sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}
        >
          <MenuIcon />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
          sx={{ display: { xs: "block", md: "none" } }}
        >
          {pages.map((page) => (
            <MenuItem
              key={page.label}
              onClick={() => {
                navigate(page.path);
                handleClose();
              }}
              sx={{
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 500,
              }}
            >
              {page.label}
            </MenuItem>
          ))}
        </Menu>

        {/* Logo */}
        <Box
          component="img"
          src={logo}
          alt="Feastly Logo"
          onClick={() => navigate("/")}
          sx={{
            height: 100,
            width: "auto",
            mr: 2,
            cursor: "pointer",
            objectFit: "contain",
            "&:hover": {
              opacity: 0.9,
            },
          }}
        />

        <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
          {pages.map((page) => (
            <Button
              key={page.label}
              onClick={() => navigate(page.path)}
              sx={{
                my: 1,
                mx: 0.5,
                color: "white",
                display: "block",
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 500,
                textTransform: "none",
                borderRadius: 2,
                px: 2,
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.12)",
                },
              }}
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
