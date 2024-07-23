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
import EditPersonForm from "../forms/EditPersonForm";
import { AppContext } from "../../../lib/contexts/AppContext";
import axios from "axios";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const EditPersonDialog: React.FC = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("AppContext must be used within an AppProvider");
  }

  const {
    dialogOpen: open,
    setDialogOpen: setOpen,
    selectedPatientId: patientId,
    setSelectedIndex,
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
    setSelectedIndex(null);
    setOpen(false);
  };

  const handleSubmit = (updatedPatient: any) => {
    if (patientId) {
      axios
        .put(`http://localhost:4000/api/patients/${patientId}`, updatedPatient)
        .then(() => {
          setMessage("Patient updated successfully.");
          loadPatients();
          setOpenSuccess(true);
          setOpen(false);
        })
        .catch(() => {
          setOpenError(true);
          setMessage(
            "There was an error updating the patient. Please try again."
          );
        });
    }

    setSelectedIndex(null);
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
            Edit Patient
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
        <EditPersonForm
          patientId={patientId}
          statuses={statuses}
          statusError={statusError}
          onSubmit={handleSubmit}
        />
      </Container>
    </Dialog>
  );
};

export default EditPersonDialog;
