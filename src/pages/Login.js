/**
 * Login component.
 * Handles user authentication including login and registration.
 *
 * @component
 * @returns {JSX.Element} The rendered Login component.
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useFirestore } from "../contexts/FirestoreContext";
import {
  Box,
  Button,
  Snackbar,
  TextField,
  Typography,
  Alert,
} from "@mui/material";

const Login = () => {
  /**
   * State to determine if the form is in registration mode.
   * @type {[boolean, Function]}
   */
  const [isRegister, setIsRegister] = useState(false);

  /**
   * State to store the user's email input.
   * @type {[string, Function]}
   */
  const [email, setEmail] = useState("");

  /**
   * State to store the user's password input.
   * @type {[string, Function]}
   */
  const [password, setPassword] = useState("");

  /**
   * State to store the user's password confirmation input during registration.
   * @type {[string, Function]}
   */
  const [confirmPassword, setConfirmPassword] = useState("");

  /**
   * State to manage notification messages.
   * @type {[Object, Function]}
   * @property {boolean} open - Indicates if the notification is visible.
   * @property {string} message - The message to display in the notification.
   * @property {string} severity - The severity level of the notification (e.g., "info", "success", "error").
   */
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const navigate = useNavigate();
  const { signup, login } = useAuth();
  const { createUser } = useFirestore();

  /**
   * Handles the registration process when the user submits the registration form.
   *
   * @async
   * @function handleRegister
   * @param {React.FormEvent<HTMLFormElement>} event - The form submission event.
   * @returns {Promise<void>}
   */
  const handleRegister = async (event) => {
    event.preventDefault();

    // Validate password strength
    if (
      password.length < 8 ||
      !/[A-Z]/.test(password) ||
      !/\d/.test(password)
    ) {
      setNotification({
        open: true,
        message:
          "Password must be at least 8 characters long, include an uppercase letter, and a number.",
        severity: "error",
      });
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      setNotification({
        open: true,
        message: "Passwords do not match.",
        severity: "error",
      });
      return;
    }

    try {
      // Create a new user with email and password
      const userCredentials = await signup(email, password);

      // Create a user document in Firestore
      await createUser(userCredentials.user.uid, userCredentials.user.email);

      // Show success notification
      setNotification({
        open: true,
        message: "Account created successfully.",
        severity: "success",
      });

      // Navigate to the dashboard
      navigate("/dashboard");
    } catch (error) {
      // Show error notification if registration fails
      setNotification({
        open: true,
        message: `Registration failed: ${error.message}`,
        severity: "error",
      });
    }
  };

  /**
   * Handles the login process when the user submits the login form.
   *
   * @async
   * @function handleLogin
   * @returns {Promise<void>}
   */
  const handleLogin = async () => {
    try {
      // Log in the user with email and password
      await login(email, password);

      // Show success notification
      setNotification({
        open: true,
        message: "Logged in successfully.",
        severity: "success",
      });

      // Navigate to the dashboard
      navigate("/dashboard");
    } catch (error) {
      // Show error notification if login fails
      setNotification({
        open: true,
        message: `Login failed: ${error.message}`,
        severity: "error",
      });
    }
  };

  /**
   * Closes the notification Snackbar.
   *
   * @function handleCloseNotification
   * @returns {void}
   */
  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Box sx={styles.container}>
      <Typography variant="h4" sx={styles.heading}>
        Welcome to Centsible!
      </Typography>
      <Box sx={styles.formContainer}>
        <TextField
          label="E-mail"
          variant="outlined"
          fullWidth
          sx={styles.input}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          sx={styles.input}
          onChange={(e) => setPassword(e.target.value)}
        />
        {isRegister && (
          <TextField
            label="Confirm Password"
            type="password"
            variant="outlined"
            fullWidth
            sx={styles.input}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        )}
        {isRegister ? (
          <>
            <Button
              variant="contained"
              fullWidth
              sx={styles.button}
              onClick={handleRegister}
            >
              Register
            </Button>
            <Button
              variant="outlined"
              fullWidth
              sx={styles.altButton}
              onClick={() => setIsRegister(false)}
            >
              Back to Login
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="contained"
              fullWidth
              sx={styles.button}
              onClick={handleLogin}
            >
              Login
            </Button>
            <Button
              variant="outlined"
              fullWidth
              sx={styles.altButton}
              onClick={() => setIsRegister(true)}
            >
              Register
            </Button>
          </>
        )}
      </Box>
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

/**
 * Styles object for the Login component.
 * Contains styling for various elements using Material-UI's sx prop.
 *
 * @type {Object}
 */
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#1e1e2f",
    color: "#ffffff",
  },
  heading: {
    marginBottom: "20px",
    color: "#79c2c2",
  },
  formContainer: {
    display: "flex",
    flexDirection: "column",
    width: "300px",
    padding: "20px",
    backgroundColor: "#24272b",
    borderRadius: "8px",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
  },
  input: {
    marginBottom: "15px",
    "& .MuiInputBase-root": {
      backgroundColor: "#2b2d42",
      borderRadius: "5px",
      color: "#ffffff",
    },
    "& .MuiInputLabel-root": {
      color: "#79c2c2",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#79c2c2",
      },
      "&:hover fieldset": {
        borderColor: "#4CAF50",
      },
    },
  },
  button: {
    marginBottom: "15px",
    backgroundColor: "#3fbf8b",
    color: "#ffffff",
    "&:hover": {
      backgroundColor: "#68a4a4",
    },
  },
  altButton: {
    borderColor: "#79c2c2",
    color: "#79c2c2",
    "&:hover": {
      backgroundColor: "#2b2d42",
    },
  },
};

export default Login;
