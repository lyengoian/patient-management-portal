import React, { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  Button,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import {
  AdditionalField,
  Address,
  Status,
  Patient,
} from "../../../lib/types/types";
import axios from "axios";
import states from "states-us";

interface Props {
  patientId: number | null;
  statuses: Status[];
  statusError: string;
  onSubmit: (updatedPatient: any) => void;
}

const EditPersonForm: React.FC<Props> = ({
  patientId,
  statuses,
  statusError,
  onSubmit,
}) => {
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState<Dayjs | null>(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [additionalFields, setAdditionalFields] = useState<AdditionalField[]>(
    []
  );
  const [removedFields, setRemovedFields] = useState<AdditionalField[]>([]);

  useEffect(() => {
    if (patientId) {
      axios
        .get(`http://localhost:4000/api/patients/${patientId}`)
        .then((response) => {
          const patient: Patient = response.data;
          setFirstName(patient.first_name);
          setMiddleName(patient.middle_name);
          setLastName(patient.last_name);
          setDateOfBirth(dayjs(patient.date_of_birth));
          setSelectedStatus(patient.status_id.toString());
          setAddresses(patient.addresses);
          setAdditionalFields(patient.additional_fields || []);
        })
        .catch((error) => {
          console.error("There was an error fetching the patient data.", error);
        });
    }
  }, [patientId]);

  const handleFieldChange = (
    field:
      | keyof Address
      | "firstName"
      | "middleName"
      | "lastName"
      | "dateOfBirth"
      | "selectedStatus",
    value: any,
    index?: number
  ) => {
    switch (field) {
      case "firstName":
        setFirstName(value);
        break;
      case "middleName":
        setMiddleName(value);
        break;
      case "lastName":
        setLastName(value);
        break;
      case "dateOfBirth":
        setDateOfBirth(value);
        break;
      case "selectedStatus":
        setSelectedStatus(value);
        break;
      default:
        if (index !== undefined) {
          const newAddresses = [...addresses];
          newAddresses[index][field] = value;
          setAddresses(newAddresses);
        }
        break;
    }
  };

  const handleAdditionalFieldChange = (
    index: number,
    field: keyof AdditionalField,
    value: string
  ) => {
    const newFields = [...additionalFields];
    newFields[index][field] = value;
    setAdditionalFields(newFields);
  };

  const handleAddAddress = () => {
    setAddresses([
      ...addresses,
      { addressLine1: "", addressLine2: "", city: "", state: "", zipCode: "" },
    ]);
  };

  const handleRemoveAddress = (index: number) => {
    const newAddresses = addresses.filter((_, i) => i !== index);
    setAddresses(newAddresses);
  };

  const handleAddField = () => {
    setAdditionalFields([
      ...additionalFields,
      { fieldName: "", fieldValue: "" },
    ]);
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
      date_of_birth: dateOfBirth?.format("MM-DD-YYYY"),
      status_id: selectedStatus,
      addresses: addresses,
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
            onChange={(e) => handleFieldChange("firstName", e.target.value)}
            required
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Middle Name"
            value={middleName}
            onChange={(e) => handleFieldChange("middleName", e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Last Name"
            value={lastName}
            onChange={(e) => handleFieldChange("lastName", e.target.value)}
            required
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Date of Birth"
              value={dateOfBirth}
              onChange={(newDate) => handleFieldChange("dateOfBirth", newDate)}
              slotProps={{ textField: { required: true, fullWidth: true } }}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required>
            <InputLabel>Status</InputLabel>
            <Select
              value={selectedStatus}
              label="Status"
              onChange={(e) =>
                handleFieldChange("selectedStatus", e.target.value)
              }
            >
              {statuses.map((status) => (
                <MenuItem key={status.id} value={status.id}>
                  {status.status_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        {addresses.map((address, index) => (
          <React.Fragment key={index}>
            <Grid item xs={12}>
              <Typography variant="h6">{`Address ${index + 1}`}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Address Line 1"
                value={address.addressLine1}
                onChange={(e) =>
                  handleFieldChange("addressLine1", e.target.value, index)
                }
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Address Line 2"
                value={address.addressLine2}
                onChange={(e) =>
                  handleFieldChange("addressLine2", e.target.value, index)
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="City"
                value={address.city}
                onChange={(e) =>
                  handleFieldChange("city", e.target.value, index)
                }
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl required fullWidth>
                <InputLabel>State</InputLabel>
                <Select
                  label="State"
                  value={address.state}
                  onChange={(e) =>
                    handleFieldChange("state", e.target.value, index)
                  }
                >
                  {states.map((option) => (
                    <MenuItem key={option.name} value={option.name}>
                      {option.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Zip Code"
                value={address.zipCode}
                onChange={(e) =>
                  handleFieldChange("zipCode", e.target.value, index)
                }
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <IconButton onClick={() => handleRemoveAddress(index)}>
                <RemoveCircleIcon />
              </IconButton>
            </Grid>
          </React.Fragment>
        ))}
        <Grid item xs={12}>
          <Button onClick={handleAddAddress} startIcon={<AddCircleIcon />}>
            Add Another Address
          </Button>
        </Grid>
        {additionalFields.map((field, index) => (
          <Grid container spacing={2} marginLeft={0} marginTop={1} key={index}>
            <Grid item xs={12} sm={5}>
              <TextField
                label="Field Name"
                value={field.fieldName}
                onChange={(e) =>
                  handleAdditionalFieldChange(
                    index,
                    "fieldName",
                    e.target.value
                  )
                }
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Field Value"
                value={field.fieldValue}
                onChange={(e) =>
                  handleAdditionalFieldChange(
                    index,
                    "fieldValue",
                    e.target.value
                  )
                }
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
