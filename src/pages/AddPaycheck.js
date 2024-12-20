/**
 * Paycheck Component
 * Manages user paychecks, including adding, editing, deleting, and displaying a list of paychecks.
 * Also visualizes paycheck trends using a line chart.
 *
 * @component
 * @example
 * return (
 *   <Paycheck />
 * )
 */

import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2"; // Line chart component from Chart.js
import {
  Box,
  Button,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
} from "@mui/material"; // Material-UI components for UI
import DeleteIcon from "@mui/icons-material/Delete"; // Delete action icon
import EditIcon from "@mui/icons-material/Edit"; // Edit action icon
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
} from "chart.js"; // Chart.js components for rendering the chart
import { useFirestore } from "../contexts/FirestoreContext"; // Firestore context for database operations
import { useAuth } from "../contexts/AuthContext"; // Auth context for current user access

// Register required Chart.js components
ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale
);

const Paycheck = () => {
  // Access current user and Firestore methods
  const { currentUser } = useAuth();
  const { getIncome, addIncome, updateIncome, deleteIncome } = useFirestore();

  // State management
  const [paychecks, setPaychecks] = useState([]); // List of paychecks
  const [formData, setFormData] = useState({ source: "", amount: "", date: "" }); // Form data for adding/updating paychecks
  const [isEditing, setIsEditing] = useState(false); // Indicates if editing mode is active
  const [editId, setEditId] = useState(null); // ID of the paycheck being edited

  /**
   * Fetches the list of paychecks from Firestore and updates the state.
   * Triggered on component mount or when the current user changes.
   */
  useEffect(() => {
    const fetchPaychecks = async () => {
      if (!currentUser) return; // Exit if no user is logged in
      const fetchedPaychecks = await getIncome(currentUser.uid, "all"); // Fetch all paychecks for the current user
      setPaychecks(fetchedPaychecks || []); // Update state with fetched data or an empty array
    };

    fetchPaychecks();
  }, [currentUser, getIncome]);

  /**
   * Handles changes in form input fields.
   * Updates the formData state with the new values.
   *
   * @param {Object} e - The input change event
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target; // Extract name and value from the input
    setFormData({ ...formData, [name]: value }); // Update the corresponding field in formData
  };

  /**
   * Handles the form submission for adding or updating a paycheck.
   * Sends the data to Firestore and refreshes the paycheck list.
   *
   * @param {Object} e - The form submission event
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    if (isEditing) {
      // If editing, update the existing paycheck
      await updateIncome(currentUser.uid, editId, {
        ...formData,
        amount: parseFloat(formData.amount), // Ensure amount is stored as a number
      });
      setIsEditing(false); // Exit editing mode
      setEditId(null); // Clear the edit ID
    } else {
      // If adding, create a new paycheck
      await addIncome(currentUser.uid, {
        ...formData,
        amount: parseFloat(formData.amount), // Ensure amount is stored as a number
      });
    }

    // Reset the form and refresh the paycheck list
    setFormData({ source: "", amount: "", date: "" });
    const updatedPaychecks = await getIncome(currentUser.uid, "all");
    setPaychecks(updatedPaychecks || []);
  };

  /**
   * Handles the deletion of a paycheck.
   * Removes the selected paycheck from Firestore and refreshes the paycheck list.
   *
   * @param {string} id - The ID of the paycheck to delete
   */
  const handleDelete = async (id) => {
    await deleteIncome(currentUser.uid, id); // Delete the paycheck by its ID
    const updatedPaychecks = await getIncome(currentUser.uid, "all"); // Refresh the paycheck list
    setPaychecks(updatedPaychecks || []);
  };

  /**
   * Handles editing a paycheck.
   * Populates the form with the data of the selected paycheck and enters editing mode.
   *
   * @param {Object} paycheck - The paycheck data to edit
   */
  const handleEdit = (paycheck) => {
    setFormData({ ...paycheck, amount: paycheck.amount.toString() }); // Populate the form with paycheck data
    setIsEditing(true); // Enter editing mode
    setEditId(paycheck.id); // Set the ID of the paycheck being edited
  };

  // Prepare data for the line chart
  const sortedPaychecks = [...paychecks].sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort paychecks by date
  const lineData = {
    labels: sortedPaychecks.map((p) => new Date(p.date).toLocaleDateString()), // Use paycheck dates as labels
    datasets: [
      {
        label: "Paycheck Amount", // Chart legend label
        data: sortedPaychecks.map((p) => p.amount), // Paycheck amounts as data points
        borderColor: "#79c2c2", // Line color
        tension: 0.3, // Curve tension for the line
        fill: false, // Disable area fill under the line
      },
    ],
  };

  // Chart configuration options
  const chartOptions = {
    responsive: true, // Make the chart responsive
    maintainAspectRatio: false, // Disable maintaining a fixed aspect ratio
    scales: {
      x: {
        type: "category", // Use category scale for the x-axis
        title: {
          display: true,
          text: "Date", // Label for the x-axis
        },
      },
      y: {
        beginAtZero: true, // Start y-axis at zero
        title: {
          display: true,
          text: "Amount ($)", // Label for the y-axis
        },
      },
    },
  };

  return (
    <Box
      sx={{
        // Container styling
        padding: "20px",
        maxWidth: "800px",
        margin: "auto",
        backgroundColor: "#1e1e2f",
        borderRadius: "10px",
        color: "#ffffff",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      }}
    >
      {/* Header */}
      <Typography
        variant="h4"
        sx={{ marginBottom: "20px", textAlign: "center", color: "#79c2c2" }}
      >
        Paycheck Management
      </Typography>

      {/* Form for adding/updating a paycheck */}
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          marginBottom: "30px",
        }}
      >
        {/* Input fields for paycheck data */}
        <TextField
          label="Source"
          name="source"
          value={formData.source}
          onChange={handleInputChange}
          required
          InputLabelProps={{ style: { color: "#79c2c2" } }}
          InputProps={{
            style: {
              color: "#ffffff",
              backgroundColor: "#2b2d42",
              borderRadius: "5px",
            },
          }}
        />
        <TextField
          label="Amount"
          name="amount"
          value={formData.amount}
          onChange={handleInputChange}
          type="number"
          required
          InputLabelProps={{ style: { color: "#79c2c2" } }}
          InputProps={{
            style: {
              color: "#ffffff",
              backgroundColor: "#2b2d42",
              borderRadius: "5px",
            },
          }}
        />
        <TextField
          label="Date"
          name="date"
          value={formData.date}
          onChange={handleInputChange}
          type="date"
          InputLabelProps={{
            shrink: true,
            style: { color: "#79c2c2" },
          }}
          InputProps={{
            style: {
              color: "#ffffff",
              backgroundColor: "#2b2d42",
              borderRadius: "5px",
            },
          }}
          required
        />
        {/* Submit button */}
        <Button
          type="submit"
          variant="contained"
          sx={{
            backgroundColor: "#79c2c2",
            color: "#ffffff",
            "&:hover": { backgroundColor: "#68a4a4" },
          }}
        >
          {isEditing ? "Update Paycheck" : "Add Paycheck"}
        </Button>
      </form>

      {/* Table of paychecks */}
      <Typography variant="h5" sx={{ color: "#79c2c2", marginBottom: "10px" }}>
        Paychecks
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            {/* Table headers */}
            <TableCell style={{ color: "#79c2c2" }}>Source</TableCell>
            <TableCell style={{ color: "#79c2c2" }} align="right">
              Amount ($)
            </TableCell>
            <TableCell style={{ color: "#79c2c2" }}>Date</TableCell>
            <TableCell style={{ color: "#79c2c2" }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* Render paycheck rows */}
          {paychecks.map((paycheck, index) => (
            <TableRow key={index}>
              <TableCell style={{ color: "#ffffff" }}>{paycheck.source}</TableCell>
              <TableCell style={{ color: "#ffffff" }} align="right">
                {paycheck.amount.toFixed(2)}
              </TableCell>
              <TableCell style={{ color: "#ffffff" }}>
                {new Date(paycheck.date).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {/* Action buttons */}
                <IconButton onClick={() => handleEdit(paycheck)}>
                  <EditIcon sx={{ color: "#79c2c2" }} />
                </IconButton>
                <IconButton onClick={() => handleDelete(paycheck.id)}>
                  <DeleteIcon sx={{ color: "#79c2c2" }} />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Line chart for paycheck trends */}
      <Box style={{ height: "400px", marginTop: "20px" }}>
        <Typography variant="h5" sx={{ color: "#79c2c2", marginBottom: "10px" }}>
          Paycheck Trend
        </Typography>
        <Line data={lineData} options={chartOptions} />
      </Box>
    </Box>
  );
};

export default Paycheck;
