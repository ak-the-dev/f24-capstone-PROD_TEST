/**
 * Spending component.
 * Displays financial data including income, expenses, and visual charts.
 *
 * @component
 * @returns {JSX.Element} The rendered Spending page.
 */

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

// Register necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const Spending = () => {
  /**
   * State to store the list of expenses.
   * @type {[Array<Object>, Function]}
   * @property {string} category - The category of the expense.
   * @property {number} amount - The amount of the expense.
   * @property {string} date - The date of the expense.
   * @property {string} merchant - The merchant associated with the expense.
   */
  const [expenseData, setExpenseData] = useState([]);

  /**
   * State to store the list of income entries.
   * @type {[Array<Object>, Function]}
   * @property {number} amount - The amount of income.
   * @property {string} date - The date of the income.
   */
  const [incomeData, setIncomeData] = useState([]);

  /**
   * State to store the filtered list of expenses.
   * @type {[Array<Object>, Function]}
   */
  const [filteredExpenses, setFilteredExpenses] = useState([]);

  /**
   * Firestore functions to retrieve expenses and income.
   * @type {Object}
   * @property {Function} getExpenses - Retrieves all expenses for a user.
   * @property {Function} getIncome - Retrieves all income entries for a user.
   */
  const { getExpenses, getIncome } = useFirestore();

  /**
   * Current authenticated user.
   * @type {Object|null}
   * @property {string} uid - The unique identifier of the user.
   */
  const { currentUser } = useAuth();

  /**
   * useEffect hook to fetch expenses and income data when the component mounts or when dependencies change.
   */
  useEffect(() => {
    /**
     * Fetches expenses and income data from Firestore.
     *
     * @async
     * @function fetchData
     * @returns {Promise<void>}
     */
    const fetchData = async () => {
      if (!currentUser) return;

      try {
        // Retrieve all expenses and income for the current user
        const expenses = await getExpenses(currentUser.uid, "all");
        const income = await getIncome(currentUser.uid, "all");

        // Update state with fetched data
        setExpenseData(expenses || []);
        setIncomeData(income || []);
        setFilteredExpenses(expenses || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [currentUser, getExpenses, getIncome]);

  /**
   * Aggregates spending by category for the pie chart.
   * @type {Object}
   */
  const spendingByCategory = expenseData.reduce((acc, expense) => {
    const category = expense.category || "Uncategorized";
    acc[category] = (acc[category] || 0) + expense.amount;
    return acc;
  }, {});

  /**
   * Data configuration for the pie chart displaying spending by category.
   * @type {Object}
   */
  const pieData = {
    labels: Object.keys(spendingByCategory),
    datasets: [
      {
        data: Object.values(spendingByCategory),
        backgroundColor: ["#79c2c2", "#36A2EB", "#FFCE56", "#4CAF50", "#FF5252"],
      },
    ],
  };

  /**
   * Aggregates financial data by month for the bar chart.
   * @type {Object}
   */
  const financialDataByMonth = [...expenseData, ...incomeData].reduce((acc, item) => {
    const month = new Date(item.date).toLocaleString("default", { month: "short", year: "numeric" });
    const type = item.amount > 0 ? (incomeData.includes(item) ? "income" : "expense") : "unknown";

    acc[month] = acc[month] || { income: 0, expense: 0 };
    acc[month][type] += item.amount;

    return acc;
  }, {});

  /**
   * Data configuration for the bar chart displaying monthly income vs expenses.
   * @type {Object}
   */
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

  /**
   * Calculates the total income.
   * @type {number}
   */
  const totalIncome = incomeData.reduce((sum, income) => sum + income.amount, 0);

  /**
   * Calculates the total expenses.
   * @type {number}
   */
  const totalExpense = expenseData.reduce((sum, expense) => sum + expense.amount, 0);

  /**
   * Calculates the balance (total income minus total expenses).
   * @type {number}
   */
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
