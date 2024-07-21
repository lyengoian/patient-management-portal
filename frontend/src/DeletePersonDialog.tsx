import React from 'react';
import {
  Button,
  Dialog,
  Slide,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import axios from 'axios';
import { TransitionProps } from '@mui/material/transitions';
import { DialogProps } from './types/types';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DeletePersonDialog: React.FC<DialogProps> = ({ open, setOpen, patientId, setOpenSuccess, setOpenError, setSelectedIndex, setMessage, loadPatients}) => {

  const handleClose = () => {
    setSelectedIndex && setSelectedIndex(null);
    setOpen(false);
  };

  const handleDelete = () => {
    axios.delete(`http://localhost:4000/api/patients/${patientId}`)
      .then(response => {
        setMessage('Patient deleted successfully.')
        loadPatients && loadPatients();
        setOpenSuccess(true);
        setOpen(false);
      })
      .catch(error => {
        setOpenError(true);
        setMessage('There was an error deleting the patient.')
      });
  };

  return (
    <React.Fragment>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle color='#913F3D'>{"Delete Patient?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            This action will permanently remove the patient from your dashboard.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" sx={{ background: '#913F3D' }} onClick={handleDelete}>Yes, Delete</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default DeletePersonDialog;
