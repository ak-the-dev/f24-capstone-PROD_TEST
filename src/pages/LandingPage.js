import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";

const SplashScreen = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    // Navigate to the dashboard after viewing the splash screen
    navigate("/dashboard");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#1e1e2f",
        color: "#ffffff",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <Typography variant="h3" sx={{ marginBottom: "20px", color: "#79c2c2" }}>
        Welcome to Centsible
      </Typography>
      <Typography variant="h6" sx={{ marginBottom: "30px" }}>
        Centsible is a budgeting app designed to educate individuals of all ages and professions 
        on managing their finances effectively. Whether you're just starting or a seasoned budgeter, 
        Centsible empowers you to enhance your budgeting skills and make smarter financial decisions.
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: "40px" }}>
        Unlock advanced features as you grow your financial knowledge and make your financial journey smoother and more effective.
      </Typography>
      <Button
        variant="contained"
        sx={{
          backgroundColor: "#79c2c2",
          color: "#ffffff",
          "&:hover": {
            backgroundColor: "#68a4a4",
          },
        }}
        onClick={handleGetStarted}
      >
        Get Started
      </Button>
    </Box>
  );
};

export default SplashScreen;
