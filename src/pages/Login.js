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
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [notification, setNotification] = useState({ open: false, message: "", severity: "info" });

  const navigate = useNavigate();
  const { signup, login } = useAuth();
  const { createUser } = useFirestore();

  const handleRegister = async (event) => {
    event.preventDefault();

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
    } else if (password !== confirmPassword) {
      setNotification({
        open: true,
        message: "Passwords do not match.",
        severity: "error",
      });
      return;
    }

    try {
      const userCredentials = await signup(email, password);
      await createUser(userCredentials.user.uid, userCredentials.user.email);
      setNotification({
        open: true,
        message: "Account created successfully.",
        severity: "success",
      });
      navigate("/dashboard");
    } catch (error) {
      setNotification({
        open: true,
        message: `Registration failed: ${error.message}`,
        severity: "error",
      });
    }
  };

  const handleLogin = async () => {
    try {
      await login(email, password);
      setNotification({
        open: true,
        message: "Logged in successfully.",
        severity: "success",
      });
      navigate("/dashboard");
    } catch (error) {
      setNotification({
        open: true,
        message: `Login failed: ${error.message}`,
        severity: "error",
      });
    }
  };

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
