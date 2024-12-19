import React, { useState, useEffect } from "react";
import { Box, Button, TextField, Avatar, Typography, Snackbar, Alert } from "@mui/material";
import { useFirestore } from "../contexts/FirestoreContext";
import { useAuth } from "../contexts/AuthContext";

const UserProfile = () => {
  const { currentUser } = useAuth();
  const { getUserData, updateUser } = useFirestore();

  const [userData, setUserData] = useState({ name: "", username: "", dob: "" });
  const [profilePicture, setProfilePicture] = useState(null);
  const [preview, setPreview] = useState("");
  const [popup, setPopup] = useState({ open: false, message: "", severity: "info" });

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        try {
          const data = await getUserData(currentUser.uid);
          if (data) {
            setUserData({ name: data.name || "", username: data.username || "", dob: data.dob || "" });
            setPreview(data.profilePicture || "");
          }
        } catch (error) {
          setPopup({
            open: true,
            message: "Failed to fetch user data.",
            severity: "error",
          });
        }
      }
    };

    fetchUserData();
  }, [currentUser, getUserData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const updatedData = { ...userData };
      if (profilePicture) {
        updatedData.profilePicture = preview;
      }
      await updateUser(currentUser.uid, updatedData);
      setPopup({
        open: true,
        message: "Profile updated successfully.",
        severity: "success",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      setPopup({
        open: true,
        message: "Failed to update profile. Please try again.",
        severity: "error",
      });
    }
  };

  const handleClosePopup = () => {
    setPopup({ ...popup, open: false });
  };

  return (
    <Box
      sx={{
        padding: "20px",
        maxWidth: "600px",
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
        User Profile
      </Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          marginBottom: "20px",
          flexDirection: "column",
        }}
      >
        <Avatar
          src={preview || "https://via.placeholder.com/150"}
          sx={{
            width: 100,
            height: 100,
            marginBottom: "10px",
            border: "2px solid #79c2c2",
          }}
        />
        <Button
          variant="outlined"
          component="label"
          sx={{ color: "#79c2c2", borderColor: "#79c2c2" }}
        >
          Change Picture
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleProfilePictureChange}
          />
        </Button>
      </Box>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <TextField
          label="Name"
          name="name"
          value={userData.name}
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
          label="Username"
          name="username"
          value={userData.username}
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
          label="Date of Birth"
          name="dob"
          value={userData.dob}
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
          Save Changes
        </Button>
      </form>
      <Snackbar
        open={popup.open}
        autoHideDuration={6000}
        onClose={handleClosePopup}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{
          top: "75px", // Adjust the vertical positioning to avoid overlapping header
          zIndex: 1400, // Ensures visibility above other elements
        }}
      >
        <Alert
          onClose={handleClosePopup}
          severity={popup.severity}
          sx={{ width: "100%" }}
        >
          {popup.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserProfile;
