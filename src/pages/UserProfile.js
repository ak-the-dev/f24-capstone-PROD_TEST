/**
 * UserProfile component.
 * Allows users to view and update their profile information, including name, username, date of birth, and profile picture.
 *
 * @component
 * @returns {JSX.Element} The rendered UserProfile page.
 */

import React, { useState, useEffect } from "react";
import { Box, Button, TextField, Avatar, Typography, Snackbar, Alert } from "@mui/material";
import { useFirestore } from "../contexts/FirestoreContext";
import { useAuth } from "../contexts/AuthContext";

const UserProfile = () => {
  /**
   * Current authenticated user.
   * @type {Object|null}
   * @property {string} uid - The unique identifier of the user.
   * @property {string} email - The email address of the user.
   */
  const { currentUser } = useAuth();

  /**
   * Firestore functions to retrieve and update user data.
   * @type {Object}
   * @property {Function} getUserData - Retrieves user data from Firestore.
   * @property {Function} updateUser - Updates user data in Firestore.
   */
  const { getUserData, updateUser } = useFirestore();

  /**
   * State to store user profile data.
   * @type {[Object, Function]}
   * @property {string} name - The user's full name.
   * @property {string} username - The user's chosen username.
   * @property {string} dob - The user's date of birth.
   */
  const [userData, setUserData] = useState({ name: "", username: "", dob: "" });

  /**
   * State to store the selected profile picture file.
   * @type {[File|null, Function]}
   */
  const [profilePicture, setProfilePicture] = useState(null);

  /**
   * State to store the preview URL of the selected profile picture.
   * @type {[string, Function]}
   */
  const [preview, setPreview] = useState("");

  /**
   * State to manage popup notifications.
   * @type {[Object, Function]}
   * @property {boolean} open - Indicates if the popup is visible.
   * @property {string} message - The message to display in the popup.
   * @property {string} severity - The severity level of the popup (e.g., "info", "success", "error").
   */
  const [popup, setPopup] = useState({ open: false, message: "", severity: "info" });

  /**
   * useEffect hook to fetch user data when the component mounts or when dependencies change.
   */
  useEffect(() => {
    /**
     * Fetches user data from Firestore.
     *
     * @async
     * @function fetchUserData
     * @returns {Promise<void>}
     */
    const fetchUserData = async () => {
      if (currentUser) {
        try {
          // Retrieve user data from Firestore
          const data = await getUserData(currentUser.uid);
          if (data) {
            // Update state with fetched data
            setUserData({
              name: data.name || "",
              username: data.username || "",
              dob: data.dob || "",
            });
            setPreview(data.profilePicture || "");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          // Show error popup if fetching fails
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

  /**
   * Handles changes in the input fields (name, username, dob).
   *
   * @function handleInputChange
   * @param {React.ChangeEvent<HTMLInputElement>} e - The input change event.
   * @returns {void}
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  /**
   * Handles the selection of a new profile picture.
   *
   * @function handleProfilePictureChange
   * @param {React.ChangeEvent<HTMLInputElement>} e - The file input change event.
   * @returns {void}
   */
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  /**
   * Handles the form submission to update user profile data.
   *
   * @async
   * @function handleSubmit
   * @param {React.FormEvent<HTMLFormElement>} e - The form submission event.
   * @returns {Promise<void>}
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Prepare updated data
      const updatedData = { ...userData };
      if (profilePicture) {
        // In a real application, you'd upload the image to a storage service and get the URL
        // Here, we'll use the preview URL for simplicity
        updatedData.profilePicture = preview;
      }

      // Update user data in Firestore
      await updateUser(currentUser.uid, updatedData);

      // Show success popup
      setPopup({
        open: true,
        message: "Profile updated successfully.",
        severity: "success",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      // Show error popup if updating fails
      setPopup({
        open: true,
        message: "Failed to update profile. Please try again.",
        severity: "error",
      });
    }
  };

  /**
   * Closes the popup notification.
   *
   * @function handleClosePopup
   * @returns {void}
   */
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
        {/* User's Profile Picture */}
        <Avatar
          src={preview || "https://via.placeholder.com/150"}
          sx={{
            width: 100,
            height: 100,
            marginBottom: "10px",
            border: "2px solid #79c2c2",
          }}
        />
        {/* Button to Change Profile Picture */}
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
      {/* Profile Update Form */}
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        {/* Name Input Field */}
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
        {/* Username Input Field */}
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
        {/* Date of Birth Input Field */}
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
        {/* Submit Button */}
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
      {/* Popup Notification */}
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
