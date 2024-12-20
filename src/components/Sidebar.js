
/**
 * Sidebar component.
 * Provides a vertical navigation menu with links to different parts of the application.
 * Includes a logout button at the bottom.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {React.ReactNode} props.children - Child components to render alongside the sidebar.
 * @returns {JSX.Element} The rendered Sidebar component.
 */

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Sidebar.css";
import { Box, IconButton, Tooltip } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../contexts/AuthContext";

const Sidebar = ({ children }) => {
  /**
   * Firestore authentication function to log out the current user.
   * Retrieved from the AuthContext.
   *
   * @type {Function}
   */
  const { logout } = useAuth();

  /**
   * React Router's navigate function.
   * Used to programmatically navigate between routes.
   *
   * @type {import('react-router-dom').NavigateFunction}
   */
  const navigate = useNavigate();

  /**
   * Handles the logout process.
   * Attempts to log out the user and navigates to the login page upon success.
   * Logs an error to the console if the logout fails.
   *
   * @async
   * @function handleLogout
   * @returns {Promise<void>}
   */
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login"); // Redirect to the login page after successful logout
    } catch (error) {
      console.error("Failed to logout:", error); // Log any errors during logout
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar container */}
      <div
        className="sidebar"
        style={{
          position: "relative", // Ensures that the logout button can be positioned absolutely within the sidebar
          height: "100vh", // Makes the sidebar span the full viewport height
          width: "200px", // Sets a fixed width for the sidebar
          backgroundColor: "#017d84", // Sets the background color of the sidebar
          paddingTop: "20px", // Adds top padding to space out the menu items
        }}
      >
        {/* Navigation Links */}
        <ul style={{ listStyleType: "none", padding: 0 }}>
          <li style={{ marginBottom: "20px", textAlign: "center" }}>
            {/* Dashboard Link */}
            <Link
              to="/dashboard"
              style={{
                textDecoration: "none",
                color: "#98E1DA",
                fontSize: "18px",
                fontWeight: "bold",
              }}
            >
              Dashboard
            </Link>
          </li>
          <li style={{ marginBottom: "20px", textAlign: "center" }}>
            {/* Purchase Link */}
            <Link
              to="/add-purchase"
              style={{
                textDecoration: "none",
                color: "#98E1DA",
                fontSize: "18px",
                fontWeight: "bold",
              }}
            >
              Purchase
            </Link>
          </li>
          <li style={{ marginBottom: "20px", textAlign: "center" }}>
            {/* Goals Link */}
            <Link
              to="/add-goal"
              style={{
                textDecoration: "none",
                color: "#98E1DA",
                fontSize: "18px",
                fontWeight: "bold",
              }}
            >
              Goals
            </Link>
          </li>
          <li style={{ marginBottom: "20px", textAlign: "center" }}>
            {/* Paycheck Link */}
            <Link
              to="/income"
              style={{
                textDecoration: "none",
                color: "#98E1DA",
                fontSize: "18px",
                fontWeight: "bold",
              }}
            >
              Paycheck
            </Link>
          </li>
          <li style={{ marginBottom: "20px", textAlign: "center" }}>
            {/* Profile Link */}
            <Link
              to="/profile"
              style={{
                textDecoration: "none",
                color: "#98E1DA",
                fontSize: "18px",
                fontWeight: "bold",
              }}
            >
              Profile
            </Link>
          </li>
        </ul>

        {/* Logout Button Icon */}
        <Box
          sx={{
            position: "absolute", // Positions the logout button at the bottom of the sidebar
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)", // Centers the logout button horizontally
          }}
        >
          {/* Tooltip provides additional information on hover */}
          <Tooltip title="Logout" arrow>
            <IconButton
              onClick={handleLogout} // Binds the logout handler to the button's onClick event
              sx={{
                color: "#ffffff", // Sets the icon color
                backgroundColor: "rgba(255, 255, 255, 0.1)", // Sets a semi-transparent background
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.2)", // Darkens the background on hover for visual feedback
                },
              }}
            >
              <LogoutIcon /> {/* Logout icon from Material-UI */}
            </IconButton>
          </Tooltip>
        </Box>
      </div>

      {/* Main content area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1, // Allows the main content to expand and fill available space
          minHeight: "100%", // Ensures the main content area covers the full height
          padding: "20px", // Adds padding around the main content
          backgroundColor: "#1e1e2f", // Sets the background color of the main content area
          color: "#ffffff", // Sets the text color for better readability
        }}
      >
        {children} {/* Renders child components passed to the Sidebar */}
      </Box>
    </Box>
  );
};

export default Sidebar;
