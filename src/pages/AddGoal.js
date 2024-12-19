import React, { useState, useEffect } from "react";
import { useFirestore } from "../contexts/FirestoreContext";
import { useAuth } from "../contexts/AuthContext";
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  Slider,
  Typography,
  LinearProgress,
} from "@mui/material";

const AddGoal = () => {
  const { currentUser } = useAuth();
  const { addUserGoal, getUserGoals, updateUserGoal, deleteUserGoal } = useFirestore();
  const [formData, setFormData] = useState({ name: "", amount: "", term: "long", priority: 2 });
  const [goals, setGoals] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const fetchGoals = async () => {
    if (!currentUser) return;
    const fetchedGoals = await getUserGoals(currentUser.uid, "all");
    setGoals(fetchedGoals || []);
  };

  useEffect(() => {
    fetchGoals();
  }, [currentUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
      await updateUserGoal(currentUser.uid, editId, formData);
      setIsEditing(false);
      setEditId(null);
    } else {
      await addUserGoal(currentUser.uid, formData);
    }
    setFormData({ name: "", amount: "", term: "long", priority: 2 });
    fetchGoals();
  };

  const handleEdit = (goal) => {
    setFormData(goal);
    setIsEditing(true);
    setEditId(goal.id);
  };

  const handleDelete = async (id) => {
    await deleteUserGoal(currentUser.uid, id);
    fetchGoals();
  };

  return (
    <Box
      sx={{
        padding: "20px",
        maxWidth: "800px",
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
        Manage Your Goals
      </Typography>

      {/* Goal Form */}
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
            onChange={(e, newValue) => setFormData({ ...formData, priority: newValue })}
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

      {/* Goals List */}
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
