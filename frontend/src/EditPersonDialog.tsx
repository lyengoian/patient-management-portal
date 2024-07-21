import React, { useState, useEffect } from 'react';
import {
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Container,
  Typography,
  Grid,
  IconButton,
  Dialog,
  AppBar,
  Toolbar,
  Slide,
  Alert,
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import CloseIcon from '@mui/icons-material/Close';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import axios from 'axios';
import { TransitionProps } from '@mui/material/transitions';
import { AdditionalField, Address, DialogProps, Patient, Status } from './types/types';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const EditPersonDialog: React.FC<DialogProps> = ({ open, setOpen, patientId, setSelectedIndex, setOpenSuccess, setOpenError, setMessage, loadPatients, statuses, statusError }) => {
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState<Dayjs | null>(null);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [dialogError, setDialogError] = useState('');
  const [address, setAddress] = useState<Address>({ addressLine1: '', addressLine2: '', city: '', state: '', zipCode: '', country: '' });
  const [additionalFields, setAdditionalFields] = useState<AdditionalField[]>([]);
  const [removedFields, setRemovedFields] = useState<AdditionalField[]>([]);

  const handleDateChange = (newDate: Dayjs | null) => {
    setDateOfBirth(newDate);
  };

  useEffect(() => {
    if (patientId) {
      axios.get(`http://localhost:4000/api/patients/${patientId}`)
        .then(response => {
          const patient: Patient = response.data;
          setFirstName(patient.first_name);
          setMiddleName(patient.middle_name);
          setLastName(patient.last_name);
          setDateOfBirth(dayjs(patient.date_of_birth));
          setSelectedStatus(patient.status_id.toString());
          setAddress(patient.address);
          setAdditionalFields(patient.additional_fields || []);
        })
        .catch(error => {
          setDialogError('There was an error fetching the patient data.')
        });
    }
  }, [patientId]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const updatedPatient = {
      first_name: firstName,
      middle_name: middleName,
      last_name: lastName,
      date_of_birth: dateOfBirth,
      status_id: selectedStatus,
      address: address,
      additional_fields: additionalFields,
      removed_fields: removedFields
    };

    if (patientId) {
      axios.put(`http://localhost:4000/api/patients/${patientId}`, updatedPatient)
        .then(response => {
          setMessage('Patient updated successfully.');
          loadPatients && loadPatients();
          setOpenSuccess(true);
          setOpen(false);
        })
        .catch(error => {
          setOpenError(true);
          setMessage('There was an error updating the patient.');
        });
    }

    setSelectedIndex && setSelectedIndex(null);
  };

  const handleAddField = () => {
    setAdditionalFields([...additionalFields, { fieldName: '', fieldType: 'text', fieldValue: '' }]);
  };

  const handleRemoveField = (index: number) => {
    const removedField = additionalFields[index];
    setRemovedFields([...removedFields, removedField]);
    const newFields = additionalFields.filter((_, i) => i !== index);
    setAdditionalFields(newFields);
  };

  const handleClose = () => {
    setSelectedIndex && setSelectedIndex(null);
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative', backgroundColor: '#DE7D41' }}>
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
        <Container maxWidth="md" sx={{ marginTop: '2%' }}>
        {statusError && <Alert sx={{ margin: 'auto', marginBottom: 1, width: 'fit-content' }} severity="error" action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setDialogError('');
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }>{statusError}</Alert>}
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Middle Name"
                  value={middleName}
                  onChange={(e) => setMiddleName(e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Date of Birth"
                    value={dateOfBirth}
                    onChange={handleDateChange}
                    slotProps={{ textField: { required: true } }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value as string)}
                  >
                    {statuses && statuses.map((status) => (
                      <MenuItem key={status.id} value={status.id}>
                        {status.status_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Address Line 1"
                  value={address.addressLine1}
                  onChange={(e) => setAddress({ ...address, addressLine1: e.target.value })}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Address Line 2"
                  value={address.addressLine2}
                  onChange={(e) => setAddress({ ...address, addressLine2: e.target.value })}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="City"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="State"
                  value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Zip Code"
                  value={address.zipCode}
                  onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Country"
                  value={address.country}
                  onChange={(e) => setAddress({ ...address, country: e.target.value })}
                  required
                  fullWidth
                />
              </Grid>
              {additionalFields && additionalFields.length > 0 && additionalFields.map((field, index) => (
                <Grid container spacing={2} marginLeft={0} marginTop={1} key={index}>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      label="Field Name"
                      value={field.fieldName}
                      onChange={(e) => {
                        const newFields = [...additionalFields];
                        newFields[index].fieldName = e.target.value;
                        setAdditionalFields(newFields);
                      }}
                      required
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <FormControl fullWidth required>
                      <InputLabel>Field Type</InputLabel>
                      <Select
                        value={field.fieldType}
                        onChange={(e) => {
                          const newFields = [...additionalFields];
                          newFields[index].fieldType = e.target.value as 'text' | 'number';
                          setAdditionalFields(newFields);
                        }}
                      >
                        <MenuItem value="text">Text</MenuItem>
                        <MenuItem value="number">Number</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Field Value"
                      value={field.fieldValue}
                      onChange={(e) => {
                        const newFields = [...additionalFields];
                        newFields[index].fieldValue = e.target.value;
                        setAdditionalFields(newFields);
                      }}
                      required
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={1}>
                    <IconButton onClick={() => handleRemoveField(index)}>
                      <RemoveCircleIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}
              <Grid item xs={12}>
                <Button onClick={handleAddField} startIcon={<AddCircleIcon />}>
                  Add Additional Field
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary" fullWidth>
                  Update Patient
                </Button>
              </Grid>
            </Grid>
          </form>
        </Container>
      </Dialog>
    </React.Fragment>
  );
};

export default EditPersonDialog;
