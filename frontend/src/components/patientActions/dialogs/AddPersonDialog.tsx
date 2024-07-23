import React, { useContext } from "react";
import {
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Slide,
  Container,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { TransitionProps } from "@mui/material/transitions";
import AddPersonForm from "../forms/AddPersonForm";
import { AppContext } from "../../../lib/contexts/AppContext";
import axios from "axios";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AddPersonDialog: React.FC = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("AppContext must be used within an AppProvider");
  }

  const {
    addDialogOpen: open,
    setAddDialogOpen: setOpen,
    setOpenSuccess,
    setOpenError,
    setMessage,
    loadPatients,
    statuses,
    statusError,
    setStatusError,
    openError,
    message,
  } = context;

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (newPatient: any) => {
    axios
      .post("http://localhost:4000/api/patients", newPatient)
      .then(() => {
        loadPatients();
        setOpenSuccess(true);
        setMessage("Patient added successfully.");
        setOpen(false);
      })
      .catch(() => {
        setOpenError(true);
        setMessage("There was an error adding the patient. Please try again.");
      });
  };

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <AppBar sx={{ position: "relative", backgroundColor: "#DE7D41" }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            New Patient
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ marginTop: "2%" }}>
        {statusError && (
          <Alert
            sx={{ margin: "auto", marginBottom: 1, width: "fit-content" }}
            severity="error"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setStatusError("");
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            {statusError}
          </Alert>
        )}
        {openError && (
          <Alert
            sx={{ margin: "auto", marginBottom: 1, width: "fit-content" }}
            severity="error"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setStatusError("");
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            {message}
          </Alert>
        )}
        <AddPersonForm statuses={statuses} onSubmit={handleSubmit} />
      </Container>
    </Dialog>
  );
};

export default AddPersonDialog;
