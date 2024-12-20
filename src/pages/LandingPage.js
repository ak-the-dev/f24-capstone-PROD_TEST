/**
 * SplashScreen / LandingPage Component
 * Serves as the introductory page for the application. Provides an overview of the app's purpose
 * and functionality, and a button to navigate to the dashboard.
 *
 * @component
 * @example
 * return (
 *   <SplashScreen />
 * )
 */

import React from "react";
import { useNavigate } from "react-router-dom"; // Navigation hook for programmatic routing
import { Box, Typography, Button } from "@mui/material"; // Material-UI components for UI design

const SplashScreen = () => {
  const navigate = useNavigate(); // Hook for navigation between routes

  /**
   * Handles navigation to the dashboard.
   * Triggered when the "Get Started" button is clicked.
   */
  const handleGetStarted = () => {
    navigate("/dashboard"); // Navigate to the dashboard route
  };

  return (
    <Box
      sx={{
        // Container styling
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh", // Full viewport height
        backgroundColor: "#1e1e2f", // Background color
        color: "#ffffff", // Text color
        padding: "20px", // Padding around content
        textAlign: "center", // Center-align text content
      }}
    >
      {/* App title */}
      <Typography
        variant="h3"
        sx={{
          marginBottom: "20px", // Space below the title
          color: "#79c2c2", // Accent color for the title
        }}
      >
        Welcome to Centsible
      </Typography>

      {/* App description */}
      <Typography
        variant="h6"
        sx={{
          marginBottom: "30px", // Space below the description
        }}
      >
        Centsible is a budgeting app designed to educate individuals of all ages and professions
        on managing their finances effectively. Whether you're just starting or a seasoned budgeter,
        Centsible empowers you to enhance your budgeting skills and make smarter financial decisions.
      </Typography>

      {/* Highlight of additional app features */}
      <Typography
        variant="body1"
        sx={{
          marginBottom: "40px", // Space below the additional highlight
        }}
      >
        Unlock advanced features as you grow your financial knowledge and make your financial journey
        smoother and more effective.
      </Typography>

      {/* Button to navigate to the dashboard */}
      <Button
        variant="contained"
        sx={{
          // Button styling
          backgroundColor: "#79c2c2", // Button background color
          color: "#ffffff", // Button text color
          "&:hover": {
            backgroundColor: "#68a4a4", // Button hover background color
          },
        }}
        onClick={handleGetStarted} // Click handler for navigation
      >
        Get Started
      </Button>
    </Box>
  );
};

export default SplashScreen;
