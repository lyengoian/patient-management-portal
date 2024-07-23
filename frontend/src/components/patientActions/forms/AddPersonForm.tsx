import React, { useState } from "react";
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
import { Dayjs } from "dayjs";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { AdditionalField, Address, Status } from "../../../lib/types/types";
import states from "states-us";

interface Props {
  statuses: Status[];
  onSubmit: (newPatient: any) => void;
}

const AddPersonForm: React.FC<Props> = ({ statuses, onSubmit }) => {
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState<Dayjs | null>(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [addresses, setAddresses] = useState<Address[]>([
    { addressLine1: "", addressLine2: "", city: "", state: "", zipCode: "" },
  ]);
  const [additionalFields, setAdditionalFields] = useState<AdditionalField[]>(
    []
  );

  const handleFieldChange = (
    index: number,
    field:
      | keyof Address
      | "firstName"
      | "middleName"
      | "lastName"
      | "dateOfBirth"
      | "selectedStatus",
    value: any
  ) => {
    if (field === "firstName") setFirstName(value);
    else if (field === "middleName") setMiddleName(value);
    else if (field === "lastName") setLastName(value);
    else if (field === "dateOfBirth") setDateOfBirth(value);
    else if (field === "selectedStatus") setSelectedStatus(value);
    else {
      const newAddresses = [...addresses];
      newAddresses[index][field] = value;
      setAddresses(newAddresses);
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

  const handleAddField = () => {
    setAdditionalFields([
      ...additionalFields,
      { fieldName: "", fieldValue: "" },
    ]);
  };

  const handleRemoveField = (index: number) => {
    setAdditionalFields(additionalFields.filter((_, i) => i !== index));
  };

  const handleAddAddress = () => {
    setAddresses([
      ...addresses,
      { addressLine1: "", addressLine2: "", city: "", state: "", zipCode: "" },
    ]);
  };

  const handleRemoveAddress = (index: number) => {
    setAddresses(addresses.filter((_, i) => i !== index));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const newPatient = {
      first_name: firstName,
      middle_name: middleName,
      last_name: lastName,
      date_of_birth: dateOfBirth,
      status_id: selectedStatus,
      addresses: addresses,
      additional_fields: additionalFields,
    };
    onSubmit(newPatient);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <TextField
            label="First Name"
            value={firstName}
            onChange={(e) => handleFieldChange(0, "firstName", e.target.value)}
            required
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Middle Name"
            value={middleName}
            onChange={(e) => handleFieldChange(0, "middleName", e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Last Name"
            value={lastName}
            onChange={(e) => handleFieldChange(0, "lastName", e.target.value)}
            required
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Date of Birth"
              value={dateOfBirth}
              onChange={(newDate: any) =>
                handleFieldChange(0, "dateOfBirth", newDate)
              }
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
                handleFieldChange(0, "selectedStatus", e.target.value)
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
            <Grid
              item
              xs={12}
              container
              alignItems="center"
              justifyContent="space-between"
            >
              <Grid item>
                <Typography variant="h6">{`Address ${index + 1}`}</Typography>
              </Grid>
              {addresses.length > 1 && (
                <Grid item>
                  <IconButton onClick={() => handleRemoveAddress(index)}>
                    <RemoveCircleIcon />
                  </IconButton>
                </Grid>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Address Line 1"
                value={address.addressLine1}
                onChange={(e) =>
                  handleFieldChange(index, "addressLine1", e.target.value)
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
                  handleFieldChange(index, "addressLine2", e.target.value)
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="City"
                value={address.city}
                onChange={(e) =>
                  handleFieldChange(index, "city", e.target.value)
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
                    handleFieldChange(index, "state", e.target.value)
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
                  handleFieldChange(index, "zipCode", e.target.value)
                }
                required
                fullWidth
              />
            </Grid>
            {addresses.length > 1 && (
              <Grid item xs={12}>
                <IconButton onClick={() => handleRemoveAddress(index)}>
                  <RemoveCircleIcon />
                </IconButton>
              </Grid>
            )}
          </React.Fragment>
        ))}
        <Grid item xs={12}>
          <Button onClick={handleAddAddress} startIcon={<AddCircleIcon />}>
            Add Another Address
          </Button>
        </Grid>
        <Grid item>
          <Typography variant="h6">Additional Fields</Typography>
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
            <Grid item xs={12}>
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
  );
};

export default AddPersonForm;
