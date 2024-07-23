import React, { useContext } from "react";
import {
  Button,
  Dialog,
  Slide,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import axios from "axios";
import { TransitionProps } from "@mui/material/transitions";
import { AppContext } from "../../../lib/contexts/AppContext";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DeletePersonDialog: React.FC = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("AppContext must be used within an AppProvider");
  }

  const {
    deleteDialogOpen: open,
    setDeleteDialogOpen: setOpen,
    selectedPatientId: patientId,
    setOpenSuccess,
    setOpenError,
    setSelectedIndex,
    setMessage,
    loadPatients,
  } = context;

  const handleClose = () => {
    setSelectedIndex(null);
    setOpen(false);
  };

  const handleDelete = () => {
    axios
      .delete(`http://localhost:4000/api/patients/${patientId}`)
      .then(() => {
        setMessage("Patient deleted successfully.");
        loadPatients();
        setOpenSuccess(true);
        handleClose();
      })
      .catch(() => {
        setOpenError(true);
        setMessage(
          "There was an error deleting the patient. Please try again."
        );
        handleClose();
      });
  };

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle color="#913F3D">{"Delete Patient?"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          This action will permanently remove the patient from your dashboard.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          variant="contained"
          sx={{ background: "#913F3D" }}
          onClick={handleDelete}
        >
          Yes, Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeletePersonDialog;
