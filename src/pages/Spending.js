import React, { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useFirestore } from "../contexts/FirestoreContext";
import { useAuth } from "../contexts/AuthContext";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const Spending = () => {
  const [expenseData, setExpenseData] = useState([]);
  const [incomeData, setIncomeData] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);

  const { getExpenses, getIncome } = useFirestore();
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) return;

      try {
        const expenses = await getExpenses(currentUser.uid, "all");
        const income = await getIncome(currentUser.uid, "all");
        setExpenseData(expenses || []);
        setIncomeData(income || []);
        setFilteredExpenses(expenses || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [currentUser, getExpenses, getIncome]);

  // Data for pie chart (Spending by Category)
  const spendingByCategory = expenseData.reduce((acc, expense) => {
    const category = expense.category || "Uncategorized";
    acc[category] = (acc[category] || 0) + expense.amount;
    return acc;
  }, {});

  const pieData = {
    labels: Object.keys(spendingByCategory),
    datasets: [
      {
        data: Object.values(spendingByCategory),
        backgroundColor: ["#79c2c2", "#36A2EB", "#FFCE56", "#4CAF50", "#FF5252"],
      },
    ],
  };

  // Data for bar chart (Monthly Spending and Income)
  const financialDataByMonth = [...expenseData, ...incomeData].reduce((acc, item) => {
    const month = new Date(item.date).toLocaleString("default", { month: "short", year: "numeric" });
    const type = item.amount > 0 ? (incomeData.includes(item) ? "income" : "expense") : "unknown";

    acc[month] = acc[month] || { income: 0, expense: 0 };
    acc[month][type] += item.amount;

    return acc;
  }, {});

  const barData = {
    labels: Object.keys(financialDataByMonth),
    datasets: [
      {
        label: "Income",
        data: Object.values(financialDataByMonth).map((d) => d.income),
        backgroundColor: "#4CAF50",
      },
      {
        label: "Expense",
        data: Object.values(financialDataByMonth).map((d) => d.expense),
        backgroundColor: "#FF5252",
      },
    ],
  };

  // Financial summary
  const totalIncome = incomeData.reduce((sum, income) => sum + income.amount, 0);
  const totalExpense = expenseData.reduce((sum, expense) => sum + expense.amount, 0);
  const balance = totalIncome - totalExpense;

  return (
    <Box
      sx={{
        padding: "20px",
        maxWidth: "900px",
        margin: "auto",
        backgroundColor: "#1e1e2f",
        borderRadius: "10px",
        color: "#ffffff",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      }}
    >
      <Typography
        variant="h4"
        sx={{ marginBottom: "20px", textAlign: "center", color: "#79c2c2" }}
      >
        Financial Overview
      </Typography>

      {/* Financial Summary */}
      <Box
        sx={{
          marginBottom: "30px",
          padding: "20px",
          backgroundColor: "#2b2d42",
          borderRadius: "10px",
        }}
      >
        <Typography variant="h6" sx={{ color: "#79c2c2", marginBottom: "10px" }}>
          Summary
        </Typography>
        <Typography>Total Income: ${totalIncome.toFixed(2)}</Typography>
        <Typography>Total Expense: ${totalExpense.toFixed(2)}</Typography>
        <Typography>Balance: ${balance.toFixed(2)}</Typography>
      </Box>

      {/* Bar Chart */}
      <Box sx={{ marginBottom: "40px" }}>
        <Typography variant="h6" sx={{ marginBottom: "10px", color: "#79c2c2" }}>
          Monthly Income vs Expense
        </Typography>
        <Box
          sx={{
            height: "400px",
            backgroundColor: "#2b2d42",
            borderRadius: "10px",
            padding: "20px",
          }}
        >
          <Bar data={barData} options={{ responsive: true, maintainAspectRatio: false }} />
        </Box>
      </Box>

      {/* Pie Chart */}
      <Box sx={{ marginBottom: "40px" }}>
        <Typography variant="h6" sx={{ marginBottom: "10px", color: "#79c2c2", textAlign: "center" }}>
          Spending by Category
        </Typography>
        <Box
          sx={{
            height: "400px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#2b2d42",
            borderRadius: "10px",
            padding: "20px",
          }}
        >
          <Pie data={pieData} />
        </Box>
      </Box>


      {/* Expense List */}
      <Box>
        <Typography variant="h6" sx={{ marginBottom: "10px", color: "#79c2c2" }}>
          Expense List
        </Typography>
        <Table
          sx={{
            backgroundColor: "#2b2d42",
            borderRadius: "10px",
            overflow: "hidden",
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: "#79c2c2" }}>Date</TableCell>
              <TableCell sx={{ color: "#79c2c2" }}>Category</TableCell>
              <TableCell sx={{ color: "#79c2c2" }}>Merchant</TableCell>
              <TableCell sx={{ color: "#79c2c2" }} align="right">
                Amount ($)
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredExpenses.map((expense, index) => (
              <TableRow key={index}>
                <TableCell sx={{ color: "#ffffff" }}>
                  {new Date(expense.date).toLocaleDateString()}
                </TableCell>
                <TableCell sx={{ color: "#ffffff" }}>
                  {expense.category || "Uncategorized"}
                </TableCell>
                <TableCell sx={{ color: "#ffffff" }}>{expense.merchant || "Unknown"}</TableCell>
                <TableCell sx={{ color: "#ffffff" }} align="right">
                  {expense.amount.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
};

export default Spending;
