import React, { useState } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import {
  Button,
  TextField,
  Typography,
  Box,
  Alert,
  IconButton,
} from "@mui/material";
import { PasswordResetFormProps } from "../../lib/types/types";
import CloseIcon from "@mui/icons-material/Close";
import FinniHealthLogo from "../../lib/assets/logo.svg";

const PasswordResetForm: React.FC<PasswordResetFormProps> = ({
  setIsResettingPassword,
}) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);

  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    const auth = getAuth();
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setMessage(
          "If your account exists, you will receive a password reset email shortly."
        );
        setShowAlert(true);
      })
      .catch((error) => {
        setError("Sorry, there was a problem. Please try again.");
        setShowAlert(true);
      });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#F0EADF",
        padding: "2rem",
      }}
    >
      <Box sx={{ marginBottom: "30px" }}>
        <img src={FinniHealthLogo} alt="Finni Health Logo" />
      </Box>
      {showAlert && error && (
        <Alert
          sx={{ marginBottom: 1, width: "fit-content" }}
          severity="error"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setShowAlert(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          {error}
        </Alert>
      )}
      {showAlert && message && (
        <Alert
          sx={{ marginBottom: 1, width: "fit-content" }}
          severity="success"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setShowAlert(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          {message}
        </Alert>
      )}
      <Typography variant="h5" sx={{ marginBottom: "1rem" }}>
        Reset Password
      </Typography>
      <form
        onSubmit={handlePasswordReset}
        style={{ width: "100%", maxWidth: "400px" }}
      >
        <Box sx={{ marginBottom: "1rem" }}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Box>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          fullWidth
          sx={{ marginBottom: "1rem" }}
        >
          Send Reset Email
        </Button>
        <Button
          color="primary"
          onClick={(e) => setIsResettingPassword(false)}
          fullWidth
          sx={{ marginBottom: "1rem" }}
        >
          Back
        </Button>
      </form>
    </Box>
  );
};

export default PasswordResetForm;
