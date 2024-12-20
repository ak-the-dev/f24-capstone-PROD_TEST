/**
 * Dashboard Component
 * Displays an overview of the user's recent financial activity, including purchases, goals, and income.
 * Provides navigation options to other features of the app via dashboard cards.
 *
 * @component
 * @example
 * return (
 *   <Dashboard />
 * )
 */

import React, { useEffect, useState } from "react";
import { Box, Snackbar, Alert, Typography, CircularProgress } from "@mui/material"; // Material-UI components
import { useFirestore } from "../contexts/FirestoreContext"; // Firestore context for database operations
import { useAuth } from "../contexts/AuthContext"; // Auth context for user authentication
import DashboardCard from "../components/DashboardCard"; // Reusable DashboardCard component
import "../styles/Dashboard.css"; // Dashboard-specific CSS

const Dashboard = () => {
  const { currentUser } = useAuth(); // Access the currently logged-in user
  const { getExpenses, getUserGoals, getIncome } = useFirestore(); // Firestore functions to fetch data

  // State variables
  const [recentPurchase, setRecentPurchase] = useState("No recent purchases found."); // Latest expense
  const [goals, setGoals] = useState("No goals currently set."); // Latest goal
  const [income, setIncome] = useState("No income reported"); // Latest income
  const [notification, setNotification] = useState({
    open: false, // Whether the notification is visible
    message: "", // Message to display in the notification
    severity: "info", // Notification type (e.g., info, error)
  });
  const [loading, setLoading] = useState(true); // Indicates whether the dashboard is loading

  /**
   * Closes the notification.
   */
  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  /**
   * Fetches data for recent purchases, goals, and income from Firestore.
   * Updates state variables with the fetched data.
   * Displays an error notification if fetching fails.
   */
  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) return; // Do nothing if no user is logged in
      setLoading(true); // Start loading spinner

      try {
        const [expenses, goalArr, currIncome] = await Promise.all([
          getExpenses(currentUser.uid), // Fetch user expenses
          getUserGoals(currentUser.uid), // Fetch user goals
          getIncome(currentUser.uid), // Fetch user income
        ]);

        // Update state with recent purchase
        if (expenses && expenses.length > 0) {
          const lastExpense = expenses[expenses.length - 1];
          setRecentPurchase(
            `Last spent: $${lastExpense.amount} for ${lastExpense.name} on ${new Date(
              lastExpense.date
            ).toLocaleDateString()}.`
          );
        }

        // Update state with the latest goal
        if (goalArr && goalArr.length > 0) {
          const lastGoal = goalArr[goalArr.length - 1];
          setGoals(`Goal: Save $${lastGoal.amount} for ${lastGoal.name}.`);
        }

        // Update state with the latest income
        if (currIncome && currIncome.length > 0) {
          const lastIncome = currIncome[currIncome.length - 1];
          setIncome(
            `Latest paycheck: $${lastIncome.amount} from ${lastIncome.source} on ${new Date(
              lastIncome.date
            ).toLocaleDateString()}.`
          );
        }
      } catch (e) {
        // Show error notification if data fetching fails
        setNotification({
          open: true,
          message: "Failed to fetch data.",
          severity: "error",
        });
      } finally {
        setLoading(false); // Stop loading spinner
      }
    };

    fetchData();
  }, [currentUser, getExpenses, getUserGoals, getIncome]);

  // Data for dashboard cards
  const cardData = [
    {
      title: "Add a purchase",
      detail: recentPurchase, // Details about the recent purchase
      link: "/add-purchase", // Navigation link
    },
    {
      title: "View your goals",
      detail: goals, // Details about goals
      link: "/add-goal", // Navigation link
    },
    {
      title: "Track your spending",
      detail: "Visualize your expenses.", // Spending visualization
      link: "/spendings", // Navigation link
    },
    {
      title: "Add a paycheck",
      detail: income, // Latest income details
      link: "/income", // Navigation link
    },
    {
      title: "Edit your profile",
      detail: "Update information", // Profile update option
      link: "/profile", // Navigation link
    },
  ];

  return (
    <Box
      sx={{
        // Dashboard container styling
        padding: "20px",
        backgroundColor: "#1e1e2f", // Background color
        minHeight: "100vh", // Full viewport height
        color: "#ffffff", // Text color
      }}
    >
      {/* Dashboard header */}
      <Typography
        variant="h4"
        sx={{
          marginBottom: "20px",
          textAlign: "center", // Center alignment
          color: "#79c2c2", // Accent color
        }}
      >
        Dashboard
      </Typography>

      {/* Show loading spinner or dashboard content */}
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center", // Center spinner horizontally
            alignItems: "center", // Center spinner vertically
            height: "60vh",
          }}
        >
          <CircularProgress color="primary" /> {/* Loading spinner */}
        </Box>
      ) : (
        <Box
          sx={{
            display: "grid", // Grid layout for dashboard cards
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", // Responsive grid
            gap: "20px", // Space between cards
            justifyContent: "center", // Center the grid
            alignItems: "start", // Align items to the top
          }}
        >
          {/* Render dashboard cards dynamically */}
          {cardData.map((card, index) => (
            <DashboardCard key={index} {...card} />
          ))}
        </Box>
      )}

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open} // Show when notification is open
        autoHideDuration={6000} // Hide after 6 seconds
        onClose={handleCloseNotification} // Close handler
        anchorOrigin={{ vertical: "top", horizontal: "center" }} // Position of the snackbar
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity} // Notification type
          sx={{ width: "100%" }}
        >
          {notification.message} {/* Notification message */}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Dashboard;
