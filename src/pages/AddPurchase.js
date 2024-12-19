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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useFirestore } from "../contexts/FirestoreContext";
import { useAuth } from "../contexts/AuthContext";

const commonStores = ["Walmart", "Amazon", "Target", "Costco", "Kroger", "Best Buy", "Whole Foods", "Aldi", "IKEA"];
const commonCategories = ["Groceries", "Utilities", "Entertainment", "Healthcare", "Transportation", "Dining", "Others"];

const AddPurchase = () => {
  const { currentUser } = useAuth();
  const { addExpenses, getExpenses, updateExpense, deleteExpense } = useFirestore();

  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    merchant: "",
    category: "",
    date: "",
  });
  const [purchases, setPurchases] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const fetchPurchases = async () => {
      if (!currentUser) return;
      const fetchedPurchases = await getExpenses(currentUser.uid, "all");
      setPurchases(fetchedPurchases || []);
    };

    fetchPurchases();
  }, [currentUser, getExpenses]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
      await updateExpense(currentUser.uid, editId, { ...formData, amount: parseFloat(formData.amount) });
      setIsEditing(false);
      setEditId(null);
    } else {
      await addExpenses(currentUser.uid, { ...formData, amount: parseFloat(formData.amount) });
    }

    setFormData({ name: "", amount: "", merchant: "", category: "", date: "" });
    const updatedPurchases = await getExpenses(currentUser.uid, "all");
    setPurchases(updatedPurchases || []);
  };

  const handleDelete = async (id) => {
    await deleteExpense(currentUser.uid, id);
    const updatedPurchases = await getExpenses(currentUser.uid, "all");
    setPurchases(updatedPurchases || []);
  };

  const handleEdit = (purchase) => {
    setFormData({ ...purchase, amount: purchase.amount.toString() });
    setIsEditing(true);
    setEditId(purchase.id);
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
        Manage Purchases
      </Typography>

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
          {isEditing ? "Update Purchase" : "Add Purchase"}
        </Button>
      </form>

      <Typography variant="h5" sx={{ color: "#79c2c2", marginBottom: "10px" }}>
        Purchases
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
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
          {purchases.map((purchase, index) => (
            <TableRow key={index}>
              <TableCell style={{ color: "#ffffff" }}>{purchase.name}</TableCell>
              <TableCell style={{ color: "#ffffff" }}>{purchase.merchant}</TableCell>
              <TableCell style={{ color: "#ffffff" }}>{purchase.category}</TableCell>
              <TableCell style={{ color: "#ffffff" }} align="right">
                {typeof purchase.amount === "number" ? purchase.amount.toFixed(2) : purchase.amount}
              </TableCell>
              <TableCell style={{ color: "#ffffff" }}>
                {new Date(purchase.date).toLocaleDateString()}
              </TableCell>
              <TableCell>
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
