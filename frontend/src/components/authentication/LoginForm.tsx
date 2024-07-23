import React, { useState, useEffect, useContext } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import PasswordResetForm from "./PasswordResetForm";
import {
  Button,
  TextField,
  Typography,
  Box,
  Alert,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FinniHealthLogo from "../../lib/assets/logo.svg";
import { auth } from "../../firebaseConfig";
import { AppContext } from "../../lib/contexts/AppContext";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [, setUser] = useState<User | null>(null);
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  const context = useContext(AppContext);
  if (!context) {
    throw new Error("AppContext must be used within an AppProvider");
  }
  const { handleLogout, showSignedUp, setShowSignedUp } = context;

  const handleFirebaseError = (error: any) => {
    switch (error.code) {
      case "auth/too-many-requests":
        setError(
          "Your account has been temporarily disabled. Please reset your password or try again later."
        );
        break;
      case "auth/invalid-credential":
        setError("Invalid credentials.");
        break;
      case "auth/email-already-in-use":
        setError("User already exists. Please sign in.");
        break;
      case "auth/weak-password":
        setError("Password too weak - must be at least 6 characters.");
        break;
      default:
        setError("Sorry, there was a problem. Please try again.");
        break;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isSignUp) {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          setShowSignedUp(true);
          setIsSignUp(false);
          setPassword("");
          handleLogout();
        })
        .catch((error) => {
          handleFirebaseError(error);
          setShowAlert(true);
        });
    } else {
      setShowAlert(false);
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          setUser(user);
          setShowSignedUp(false);
        })
        .catch((error) => {
          handleFirebaseError(error);
          setShowAlert(true);
        });
    }
  };

  if (isResettingPassword) {
    return (
      <PasswordResetForm setIsResettingPassword={setIsResettingPassword} />
    );
  }

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
      {showAlert && (
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
      {showSignedUp && (
        <Alert
          sx={{ marginBottom: 1, width: "fit-content" }}
          severity="success"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setShowSignedUp(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          Sign up successful! Please login.
        </Alert>
      )}

      <Typography variant="h5" sx={{ marginBottom: "1rem" }}>
        {isSignUp ? "Sign Up" : "Sign In"}
      </Typography>
      <form
        onSubmit={handleFormSubmit}
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
            sx={{ marginBottom: "1rem" }}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
          {isSignUp ? "Sign Up" : "Sign In"}
        </Button>
      </form>
      <Button
        onClick={() => setIsResettingPassword(true)}
        sx={{ marginBottom: "1rem" }}
      >
        Forgot Password?
      </Button>
      <Typography variant="body1" sx={{ marginBottom: "0.5rem" }}>
        {isSignUp ? "First time using the portal?" : "Already have an account?"}
      </Typography>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => {
          setIsSignUp(!isSignUp);
          setShowAlert(false);
        }}
      >
        {isSignUp ? "Sign In" : "Sign Up"}
      </Button>
    </Box>
  );
};

export default LoginForm;
