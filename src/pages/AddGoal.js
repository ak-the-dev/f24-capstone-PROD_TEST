/**
 * Goal Component
 * Allows users to manage their financial goals. Users can add, edit, delete, and view their goals.
 * Goals are stored in Firestore and displayed in a list format with progress indicators.
 *
 * @component
 * @example
 * return (
 *   <AddGoal />
 * )
 */

import React, { useState, useEffect } from "react";
import { useFirestore } from "../contexts/FirestoreContext"; // Firestore context for database operations
import { useAuth } from "../contexts/AuthContext"; // Auth context for accessing current user
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  Slider,
  Typography,
  LinearProgress,
} from "@mui/material"; // Material-UI components for styling

const AddGoal = () => {
  // Access the current user and Firestore methods
  const { currentUser } = useAuth();
  const { addUserGoal, getUserGoals, updateUserGoal, deleteUserGoal } = useFirestore();

  // State management for goals and form data
  const [formData, setFormData] = useState({
    name: "", // Name of the goal
    amount: "", // Target amount for the goal
    term: "long", // Term of the goal: long-term or short-term
    priority: 2, // Priority level (1-3)
  });
  const [goals, setGoals] = useState([]); // List of goals fetched from Firestore
  const [isEditing, setIsEditing] = useState(false); // Toggle between add and edit modes
  const [editId, setEditId] = useState(null); // ID of the goal being edited

  /**
   * Fetches the list of goals from Firestore and updates the state.
   * Triggered on component mount or when the current user changes.
   */
  const fetchGoals = async () => {
    if (!currentUser) return; // Exit if no user is logged in
    const fetchedGoals = await getUserGoals(currentUser.uid, "all"); // Fetch all goals for the current user
    setGoals(fetchedGoals || []); // Update state with fetched data or an empty array
  };

  useEffect(() => {
    fetchGoals();
  }, [currentUser]);

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
   * Handles the form submission for adding or updating a goal.
   * Sends the data to Firestore and refreshes the goals list.
   *
   * @param {Object} e - The form submission event
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    if (isEditing) {
      // If editing, update the existing goal
      await updateUserGoal(currentUser.uid, editId, formData);
      setIsEditing(false); // Exit editing mode
      setEditId(null); // Clear the edit ID
    } else {
      // If adding, create a new goal
      await addUserGoal(currentUser.uid, formData);
    }
    setFormData({ name: "", amount: "", term: "long", priority: 2 }); // Reset the form data
    fetchGoals(); // Refresh the goals list
  };

  /**
   * Handles editing a goal.
   * Populates the form with the selected goal's data and enters editing mode.
   *
   * @param {Object} goal - The goal to edit
   */
  const handleEdit = (goal) => {
    setFormData(goal); // Populate the form with the goal's data
    setIsEditing(true); // Enter editing mode
    setEditId(goal.id); // Set the ID of the goal being edited
  };

  /**
   * Handles deleting a goal.
   * Removes the selected goal from Firestore and refreshes the goals list.
   *
   * @param {string} id - The ID of the goal to delete
   */
  const handleDelete = async (id) => {
    await deleteUserGoal(currentUser.uid, id); // Delete the goal by its ID
    fetchGoals(); // Refresh the goals list
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
        Manage Your Goals
      </Typography>

      {/* Form for adding/updating a goal */}
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          marginBottom: "30px",
        }}
      >
        <TextField
          label="Goal Name"
          name="name"
          value={formData.name}
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
        <Select
          name="term"
          value={formData.term}
          onChange={handleInputChange}
          sx={{
            color: "#ffffff",
            backgroundColor: "#2b2d42",
            borderRadius: "5px",
          }}
        >
          <MenuItem value="long">Long Term</MenuItem>
          <MenuItem value="short">Short Term</MenuItem>
        </Select>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Slider
            value={formData.priority}
            onChange={(e, newValue) =>
              setFormData({ ...formData, priority: newValue })
            }
            min={1}
            max={3}
            sx={{
              flexGrow: 1,
              color: "#79c2c2",
            }}
          />
          <Typography sx={{ marginLeft: "10px", color: "#79c2c2" }}>
            Priority: {formData.priority}
          </Typography>
        </Box>
        <Button
          type="submit"
          variant="contained"
          sx={{
            backgroundColor: "#79c2c2",
            color: "#ffffff",
            "&:hover": { backgroundColor: "#68a4a4" },
          }}
        >
          {isEditing ? "Update Goal" : "Add Goal"}
        </Button>
      </form>

      {/* List of goals */}
      <Typography variant="h5" sx={{ color: "#79c2c2", marginBottom: "10px" }}>
        Your Goals
      </Typography>
      {goals.map((goal) => (
        <Box
          key={goal.id}
          sx={{
            marginBottom: "15px",
            padding: "15px",
            backgroundColor: "#2b2d42",
            borderRadius: "10px",
            color: "#ffffff",
          }}
        >
          <Typography variant="h6" sx={{ marginBottom: "5px", color: "#79c2c2" }}>
            {goal.name}
          </Typography>
          <Typography>Target: ${goal.amount}</Typography>
          <Typography>Priority: {goal.priority}</Typography>
          <Typography>Term: {goal.term}</Typography>
          <LinearProgress
            variant="determinate"
            value={(goal.saved / goal.amount) * 100}
            sx={{
              backgroundColor: "#394049",
              "& .MuiLinearProgress-bar": {
                backgroundColor: "#79c2c2",
              },
              marginTop: "10px",
            }}
          />
          <Box sx={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <Button
              variant="outlined"
              sx={{
                color: "#79c2c2",
                borderColor: "#79c2c2",
                "&:hover": { backgroundColor: "#2b2d42" },
              }}
              onClick={() => handleEdit(goal)}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              sx={{
                color: "#FF5252",
                borderColor: "#FF5252",
                "&:hover": { backgroundColor: "#2b2d42" },
              }}
              onClick={() => handleDelete(goal.id)}
            >
              Delete
            </Button>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default AddGoal;
