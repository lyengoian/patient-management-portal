import React, { useState, useEffect } from 'react';
import { Grid, TextField, Button, IconButton, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { AdditionalField, Address, Status, Patient } from '../../../lib/types/types';
import axios from 'axios';

interface Props {
  patientId: number | null;
  statuses: Status[];
  statusError: string;
  onSubmit: (updatedPatient: any) => void;
}

const EditPersonForm: React.FC<Props> = ({ patientId, statuses, statusError, onSubmit }) => {
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState<Dayjs | null>(null);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [address, setAddress] = useState<Address>({
    addressLine1: '', addressLine2: '', city: '', state: '', zipCode: '', country: ''
  });
  const [additionalFields, setAdditionalFields] = useState<AdditionalField[]>([]);
  const [removedFields, setRemovedFields] = useState<AdditionalField[]>([]);

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
          console.error('There was an error fetching the patient data.', error);
        });
    }
  }, [patientId]);

  const handleFieldChange = (field: keyof Address | 'firstName' | 'middleName' | 'lastName' | 'dateOfBirth' | 'selectedStatus', value: any) => {
    switch (field) {
      case 'firstName': setFirstName(value); break;
      case 'middleName': setMiddleName(value); break;
      case 'lastName': setLastName(value); break;
      case 'dateOfBirth': setDateOfBirth(value); break;
      case 'selectedStatus': setSelectedStatus(value); break;
      default: setAddress({ ...address, [field]: value });
    }
  };

  const handleAdditionalFieldChange = (index: number, field: keyof AdditionalField, value: string) => {
    const newFields = [...additionalFields];
    newFields[index][field] = value;
    setAdditionalFields(newFields);
  };

  const handleAddField = () => {
    setAdditionalFields([...additionalFields, { fieldName: '', fieldValue: '' }]);
  };

  const handleRemoveField = (index: number) => {
    const removedField = additionalFields[index];
    setRemovedFields([...removedFields, removedField]);
    const newFields = additionalFields.filter((_, i) => i !== index);
    setAdditionalFields(newFields);
  };

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
      removed_fields: removedFields,
    };

    onSubmit(updatedPatient);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <TextField
            label="First Name"
            value={firstName}
            onChange={(e) => handleFieldChange('firstName', e.target.value)}
            required
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Middle Name"
            value={middleName}
            onChange={(e) => handleFieldChange('middleName', e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Last Name"
            value={lastName}
            onChange={(e) => handleFieldChange('lastName', e.target.value)}
            required
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Date of Birth"
              value={dateOfBirth}
              onChange={(newDate) => handleFieldChange('dateOfBirth', newDate)}
              slotProps={{ textField: { required: true } }}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required>
            <InputLabel>Status</InputLabel>
            <Select
              value={selectedStatus}
              onChange={(e) => handleFieldChange('selectedStatus', e.target.value)}
            >
              {statuses.map((status) => (
                <MenuItem key={status.id} value={status.id}>
                  {status.status_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        {Object.keys(address).map((key) => (
          <Grid item xs={12} sm={6} key={key}>
            <TextField
              label={key.charAt(0).toUpperCase() + key.slice(1).replace(/[A-Z]/g, ' $&')}
              value={address[key as keyof Address]}
              onChange={(e) => handleFieldChange(key as keyof Address, e.target.value)}
              required={key !== 'addressLine2'}
              fullWidth
            />
          </Grid>
        ))}
        {additionalFields.map((field, index) => (
          <Grid container spacing={2} marginLeft={0} marginTop={1} key={index}>
            <Grid item xs={12} sm={5}>
              <TextField
                label="Field Name"
                value={field.fieldName}
                onChange={(e) => handleAdditionalFieldChange(index, 'fieldName', e.target.value)}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Field Value"
                value={field.fieldValue}
                onChange={(e) => handleAdditionalFieldChange(index, 'fieldValue', e.target.value)}
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
  );
};

export default EditPersonForm;
