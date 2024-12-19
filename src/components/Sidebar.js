import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Sidebar.css";
import { Box, IconButton, Tooltip } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../contexts/AuthContext";

const Sidebar = ({ children }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <div className="sidebar" style={{ position: "relative", height: "100vh" }}>
        <ul>
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/add-purchase">Purchase</Link>
          </li>
          <li>
            <Link to="/add-goal">Goals</Link>
          </li>
          <li>
            <Link to="/income">Paycheck</Link>
          </li>
          <li>
            <Link to="/profile">Profile</Link>
          </li>
        </ul>
        {/* Logout Button Icon */}
        <Box
          sx={{
            position: "absolute",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <Tooltip title="Logout" arrow>
            <IconButton
              onClick={handleLogout}
              sx={{
                color: "#ffffff",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                },
              }}
            >
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </div>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: "100%",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Sidebar;
