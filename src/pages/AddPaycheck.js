import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
} from "chart.js";
import { useFirestore } from "../contexts/FirestoreContext";
import { useAuth } from "../contexts/AuthContext";

// Register Chart.js components
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
  const { currentUser } = useAuth();
  const { getIncome, addIncome, updateIncome, deleteIncome } = useFirestore();

  const [paychecks, setPaychecks] = useState([]);
  const [formData, setFormData] = useState({ source: "", amount: "", date: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const fetchPaychecks = async () => {
      if (!currentUser) return;
      const fetchedPaychecks = await getIncome(currentUser.uid, "all");
      setPaychecks(fetchedPaychecks || []);
    };

    fetchPaychecks();
  }, [currentUser, getIncome]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
      await updateIncome(currentUser.uid, editId, {
        ...formData,
        amount: parseFloat(formData.amount),
      });
      setIsEditing(false);
      setEditId(null);
    } else {
      await addIncome(currentUser.uid, {
        ...formData,
        amount: parseFloat(formData.amount),
      });
    }

    setFormData({ source: "", amount: "", date: "" });
    const updatedPaychecks = await getIncome(currentUser.uid, "all");
    setPaychecks(updatedPaychecks || []);
  };

  const handleDelete = async (id) => {
    await deleteIncome(currentUser.uid, id);
    const updatedPaychecks = await getIncome(currentUser.uid, "all");
    setPaychecks(updatedPaychecks || []);
  };

  const handleEdit = (paycheck) => {
    setFormData({ ...paycheck, amount: paycheck.amount.toString() });
    setIsEditing(true);
    setEditId(paycheck.id);
  };

  // Line Chart Data
  const sortedPaychecks = [...paychecks].sort((a, b) => new Date(a.date) - new Date(b.date));
  const lineData = {
    labels: sortedPaychecks.map((p) => new Date(p.date).toLocaleDateString()),
    datasets: [
      {
        label: "Paycheck Amount",
        data: sortedPaychecks.map((p) => p.amount),
        borderColor: "#79c2c2",
        tension: 0.3,
        fill: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: "category",
        title: {
          display: true,
          text: "Date",
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Amount ($)",
        },
      },
    },
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
        Paycheck Management
      </Typography>

      {/* Paycheck Form */}
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

      {/* Paycheck List */}
      <Typography variant="h5" sx={{ color: "#79c2c2", marginBottom: "10px" }}>
        Paychecks
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={{ color: "#79c2c2" }}>Source</TableCell>
            <TableCell style={{ color: "#79c2c2" }} align="right">
              Amount ($)
            </TableCell>
            <TableCell style={{ color: "#79c2c2" }}>Date</TableCell>
            <TableCell style={{ color: "#79c2c2" }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
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

      {/* Line Chart */}
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
