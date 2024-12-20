/**
 * Purchase Component
 * Provides functionality to manage purchases, including adding, editing, deleting, and viewing a list of purchases.
 * Integrates with Firestore for persistent data storage.
 *
 * @component
 * @example
 * return (
 *   <AddPurchase />
 * )
 */

import React, { useState, useEffect } from "react";
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
  Autocomplete,
} from "@mui/material"; // Material-UI components for UI
import DeleteIcon from "@mui/icons-material/Delete"; // Delete icon
import EditIcon from "@mui/icons-material/Edit"; // Edit icon
import { useFirestore } from "../contexts/FirestoreContext"; // Firestore context for database operations
import { useAuth } from "../contexts/AuthContext"; // Auth context for accessing the current user

// Predefined list of common merchants
const commonStores = ["Walmart", "Amazon", "Target", "Costco", "Kroger", "Best Buy", "Whole Foods", "Aldi", "IKEA"];

// Predefined list of common expense categories
const commonCategories = [
  "Groceries",
  "Utilities",
  "Entertainment",
  "Healthcare",
  "Transportation",
  "Dining",
  "Others",
];

const AddPurchase = () => {
  // Access the current user and Firestore methods
  const { currentUser } = useAuth();
  const { addExpenses, getExpenses, updateExpense, deleteExpense } = useFirestore();

  // State management
  const [formData, setFormData] = useState({
    name: "", // Name of the purchased item
    amount: "", // Amount spent
    merchant: "", // Merchant name
    category: "", // Expense category
    date: "", // Date of purchase
  });
  const [purchases, setPurchases] = useState([]); // List of purchases
  const [isEditing, setIsEditing] = useState(false); // Indicates if editing mode is active
  const [editId, setEditId] = useState(null); // ID of the purchase being edited

  /**
   * Fetches the list of purchases from Firestore and updates the state.
   * Triggered on component mount or when the current user changes.
   */
  useEffect(() => {
    const fetchPurchases = async () => {
      if (!currentUser) return; // Exit if no user is logged in
      const fetchedPurchases = await getExpenses(currentUser.uid, "all"); // Fetch all expenses for the current user
      setPurchases(fetchedPurchases || []); // Update state with fetched data or an empty array
    };

    fetchPurchases();
  }, [currentUser, getExpenses]);

  /**
   * Handles changes in form input fields.
   * Updates the formData state with the new values.
   *
   * @param {Object} e - The input change event
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target; // Extract name and value from the input
    setFormData({ ...formData, [name]: value }); // Update corresponding field in formData
  };

  /**
   * Handles the form submission for adding or updating a purchase.
   * Sends the data to Firestore and refreshes the purchases list.
   *
   * @param {Object} e - The form submission event
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    if (isEditing) {
      // If editing, update the existing purchase
      await updateExpense(currentUser.uid, editId, {
        ...formData,
        amount: parseFloat(formData.amount), // Ensure amount is stored as a number
      });
      setIsEditing(false); // Exit editing mode
      setEditId(null); // Clear the edit ID
    } else {
      // If adding, create a new purchase
      await addExpenses(currentUser.uid, {
        ...formData,
        amount: parseFloat(formData.amount), // Ensure amount is stored as a number
      });
    }

    // Reset the form and refresh the purchases list
    setFormData({ name: "", amount: "", merchant: "", category: "", date: "" });
    const updatedPurchases = await getExpenses(currentUser.uid, "all");
    setPurchases(updatedPurchases || []);
  };

  /**
   * Handles the deletion of a purchase.
   * Removes the selected purchase from Firestore and refreshes the purchases list.
   *
   * @param {string} id - The ID of the purchase to delete
   */
  const handleDelete = async (id) => {
    await deleteExpense(currentUser.uid, id); // Delete the expense by its ID
    const updatedPurchases = await getExpenses(currentUser.uid, "all"); // Refresh the purchases list
    setPurchases(updatedPurchases || []);
  };

  /**
   * Handles editing a purchase.
   * Populates the form with the data of the selected purchase and enters editing mode.
   *
   * @param {Object} purchase - The purchase data to edit
   */
  const handleEdit = (purchase) => {
    setFormData({ ...purchase, amount: purchase.amount.toString() }); // Populate the form with purchase data
    setIsEditing(true); // Enter editing mode
    setEditId(purchase.id); // Set the ID of the purchase being edited
  };

  return (
    <Box
      sx={{
        // Styling for the container
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
        Manage Purchases
      </Typography>

      {/* Form for adding/updating a purchase */}
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          marginBottom: "30px",
        }}
      >
        {/* Input for item name */}
        <TextField
          label="Item Name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
          InputLabelProps={{
            style: { color: "#79c2c2" },
          }}
          InputProps={{
            style: {
              color: "#ffffff",
              backgroundColor: "#2b2d42",
              borderRadius: "5px",
            },
          }}
        />
        {/* Input for amount */}
        <TextField
          label="Amount"
          name="amount"
          value={formData.amount}
          onChange={handleInputChange}
          type="number"
          required
          InputLabelProps={{
            style: { color: "#79c2c2" },
          }}
          InputProps={{
            style: {
              color: "#ffffff",
              backgroundColor: "#2b2d42",
              borderRadius: "5px",
            },
          }}
        />
        {/* Autocomplete for merchant */}
        <Autocomplete
          options={commonStores}
          getOptionLabel={(option) => option}
          value={formData.merchant}
          onInputChange={(event, newValue) => setFormData({ ...formData, merchant: newValue })}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Merchant"
              name="merchant"
              required
              InputLabelProps={{
                style: { color: "#79c2c2" },
              }}
              InputProps={{
                ...params.InputProps,
                style: {
                  color: "#ffffff",
                  backgroundColor: "#2b2d42",
                  borderRadius: "5px",
                },
              }}
            />
          )}
        />
        {/* Autocomplete for category */}
        <Autocomplete
          options={commonCategories}
          getOptionLabel={(option) => option}
          value={formData.category}
          onInputChange={(event, newValue) => setFormData({ ...formData, category: newValue })}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Category"
              name="category"
              required
              InputLabelProps={{
                style: { color: "#79c2c2" },
              }}
              InputProps={{
                ...params.InputProps,
                style: {
                  color: "#ffffff",
                  backgroundColor: "#2b2d42",
                  borderRadius: "5px",
                },
              }}
            />
          )}
        />
        {/* Input for date */}
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
          {isEditing ? "Update Purchase" : "Add Purchase"}
        </Button>
      </form>

      {/* Table of purchases */}
      <Typography variant="h5" sx={{ color: "#79c2c2", marginBottom: "10px" }}>
        Purchases
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            {/* Table headers */}
            <TableCell style={{ color: "#79c2c2" }}>Item</TableCell>
            <TableCell style={{ color: "#79c2c2" }}>Merchant</TableCell>
            <TableCell style={{ color: "#79c2c2" }}>Category</TableCell>
            <TableCell style={{ color: "#79c2c2" }} align="right">
              Amount ($)
            </TableCell>
            <TableCell style={{ color: "#79c2c2" }}>Date</TableCell>
            <TableCell style={{ color: "#79c2c2" }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* Render purchase rows */}
          {purchases.map((purchase, index) => (
            <TableRow key={index}>
              <TableCell style={{ color: "#ffffff" }}>{purchase.name}</TableCell>
              <TableCell style={{ color: "#ffffff" }}>{purchase.merchant}</TableCell>
              <TableCell style={{ color: "#ffffff" }}>{purchase.category}</TableCell>
              <TableCell style={{ color: "#ffffff" }} align="right">
                {typeof purchase.amount === "number"
                  ? purchase.amount.toFixed(2)
                  : purchase.amount}
              </TableCell>
              <TableCell style={{ color: "#ffffff" }}>
                {new Date(purchase.date).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {/* Action buttons */}
                <IconButton onClick={() => handleEdit(purchase)}>
                  <EditIcon sx={{ color: "#79c2c2" }} />
                </IconButton>
                <IconButton onClick={() => handleDelete(purchase.id)}>
                  <DeleteIcon sx={{ color: "#79c2c2" }} />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default AddPurchase;
