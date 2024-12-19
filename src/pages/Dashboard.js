import React, { useEffect, useState } from "react";
import { Box, Snackbar, Alert, Typography, CircularProgress } from "@mui/material";
import { useFirestore } from "../contexts/FirestoreContext";
import { useAuth } from "../contexts/AuthContext";
import DashboardCard from "../components/DashboardCard";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const { currentUser } = useAuth();
  const { getExpenses, getUserGoals, getIncome } = useFirestore();
  const [recentPurchase, setRecentPurchase] = useState("No recent purchases found.");
  const [goals, setGoals] = useState("No goals currently set.");
  const [income, setIncome] = useState("No income reported");
  const [notification, setNotification] = useState({ open: false, message: "", severity: "info" });
  const [loading, setLoading] = useState(true);

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) return;
      setLoading(true);

      try {
        const [expenses, goalArr, currIncome] = await Promise.all([
          getExpenses(currentUser.uid),
          getUserGoals(currentUser.uid),
          getIncome(currentUser.uid),
        ]);

        // Recent purchase
        if (expenses && expenses.length > 0) {
          const lastExpense = expenses[expenses.length - 1];
          setRecentPurchase(
            `Last spent: $${lastExpense.amount} for ${lastExpense.name} on ${new Date(
              lastExpense.date
            ).toLocaleDateString()}.`
          );
        }

        // Goals
        if (goalArr && goalArr.length > 0) {
          const lastGoal = goalArr[goalArr.length - 1];
          setGoals(`Goal: Save $${lastGoal.amount} for ${lastGoal.name}.`);
        }

        // Income
        if (currIncome && currIncome.length > 0) {
          const lastIncome = currIncome[currIncome.length - 1];
          setIncome(
            `Latest paycheck: $${lastIncome.amount} from ${lastIncome.source} on ${new Date(
              lastIncome.date
            ).toLocaleDateString()}.`
          );
        }
      } catch (e) {
        setNotification({
          open: true,
          message: "Failed to fetch data.",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser, getExpenses, getUserGoals, getIncome]);

  const cardData = [
    {
      title: "Add a purchase",
      detail: recentPurchase,
      link: "/add-purchase",
    },
    {
      title: "View your goals",
      detail: goals,
      link: "/add-goal",
    },
    {
      title: "Track your spending",
      detail: "Visualize your expenses.",
      link: "/spendings",
    },
    {
      title: "Add a paycheck",
      detail: income,
      link: "/income",
    },
    {
      title: "Edit your profile",
      detail: "Update information",
      link: "/profile",
    },
  ];

  return (
    <Box
      sx={{
        padding: "20px",
        backgroundColor: "#1e1e2f",
        minHeight: "100vh",
        color: "#ffffff",
      }}
    >
      <Typography
        variant="h4"
        sx={{
          marginBottom: "20px",
          textAlign: "center",
          color: "#79c2c2",
        }}
      >
        Dashboard
      </Typography>

      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "60vh",
          }}
        >
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "20px",
            justifyContent: "center",
            alignItems: "start",
          }}
        >
          {cardData.map((card, index) => (
            <DashboardCard key={index} {...card} />
          ))}
        </Box>
      )}

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Dashboard;
