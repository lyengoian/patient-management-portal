import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
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
  Alert,
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import axios from 'axios';
import { AdditionalField, Address, DialogProps, Status } from './types/types';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AddPersonDialog({ open, setOpen, setOpenSuccess, setOpenError, setMessage, loadPatients, statuses, statusError, setStatusError }: DialogProps) {
  const [firstName, setFirstName] = React.useState('');
  const [middleName, setMiddleName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [dateOfBirth, setDateOfBirth] = React.useState<Dayjs | null>(null);
  const [selectedStatus, setSelectedStatus] = React.useState('');
  const [address, setAddress] = React.useState<Address>({ addressLine1: '', addressLine2: '', city: '', state: '', zipCode: '', country: '' });
  const [additionalFields, setAdditionalFields] = React.useState<AdditionalField[]>([{ fieldName: '', fieldType: 'text', fieldValue: '' }]);
  const [dialogError, setDialogError] = React.useState('');

  const handleDateChange = (newDate: Dayjs | null) => {
    setDateOfBirth(newDate);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const newPatient = {
      first_name: firstName,
      middle_name: middleName,
      last_name: lastName,
      date_of_birth: dateOfBirth,
      status_id: selectedStatus,
      address: address,
      additional_fields: additionalFields
    };

    axios.post('http://localhost:4000/api/patients', newPatient)
      .then(response => {
        loadPatients && loadPatients();
        setOpenSuccess(true);
        setMessage('Patient added successfully.');
        setOpen(false);
      })
      .catch(error => {
        setOpenError(true);
        setMessage('There was an error adding the patient.');
      });
  };

  const handleAddField = () => {
    setAdditionalFields([...additionalFields, { fieldName: '', fieldType: 'text', fieldValue: '' }]);
  };

  const handleRemoveField = (index: number) => {
    const newFields = additionalFields.filter((_, i) => i !== index);
    setAdditionalFields(newFields);
  };

  const handleClose = () => {
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
              New Patient
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
                setStatusError && setStatusError('');
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
                <FormControl fullWidth required>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Date of Birth"
                      value={dateOfBirth}
                      onChange={handleDateChange}
                      slotProps={{ textField: { required: true } }}
                    />
                  </LocalizationProvider>
                </FormControl>
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

              {additionalFields.map((field, index) => (
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
                  <Grid item xs={2} sm={1}>
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
                <Button type="submit" variant="contained" fullWidth>
                  Add Patient
                </Button>
              </Grid>
            </Grid>
          </form>
        </Container>
      </Dialog>
    </React.Fragment>
  );
}
