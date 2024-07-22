import React, { useEffect, useState, useContext } from 'react';
import {
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Grid,
  Slide,
  Card,
  CardContent,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { TransitionProps } from '@mui/material/transitions';
import axios from 'axios';
import dayjs from 'dayjs';
import { Address, Patient, Status } from '../../lib/types/types';
import { AppContext } from '../../lib/contexts/AppContext';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const InfoCard: React.FC = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('AppContext must be used within an AppProvider');
  }

  const {
    infoCardOpen: open,
    setInfoCardOpen: setOpen,
    selectedPatientId: patientId,
    setSelectedIndex,
  } = context;

  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [address, setAddress] = useState<Address>({
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });
  const [additionalFields, setAdditionalFields] = useState<any[]>([]);

  useEffect(() => {
    axios.get('http://localhost:4000/api/statuses')
      .then(response => {
        setStatuses(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the statuses!', error);
      });
  }, []);

  useEffect(() => {
    if (patientId) {
      axios.get(`http://localhost:4000/api/patients/${patientId}`)
        .then(response => {
          const patient: Patient = response.data;
          setFirstName(patient.first_name);
          setMiddleName(patient.middle_name);
          setLastName(patient.last_name);
          setDateOfBirth(dayjs(patient.date_of_birth).format('YYYY-MM-DD'));
          setSelectedStatus(patient.status_id.toString());
          setAddress(patient.address);
          setAdditionalFields(patient.additional_fields || []);
        })
        .catch(error => {
          console.error('There was an error fetching the patient data.', error);
        });
    }
  }, [patientId]);

  const handleClose = () => {
    setSelectedIndex(null);
    setOpen(false);
  };

  return (
    <Dialog
      fullWidth
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
          <Typography sx={{ ml: 2, flex: 1 }} variant="subtitle1" component="div">
            Patient Details
          </Typography>
        </Toolbar>
      </AppBar>
      <Card sx={{ padding: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            {renderInfo("First Name", firstName)}
            {renderInfo("Middle Name", middleName)}
            {renderInfo("Last Name", lastName)}
            {renderInfo("Date of Birth", dateOfBirth)}
            {renderInfo("Status", statuses.find(status => status.id.toString() === selectedStatus)?.status_name)}
            {renderInfo("Address Line 1", address.addressLine1)}
            {renderInfo("Address Line 2", address.addressLine2)}
            {renderInfo("City", address.city)}
            {renderInfo("State", address.state)}
            {renderInfo("Zip Code", address.zipCode)}
            {renderInfo("Country", address.country)}
            {additionalFields.map((field, index) => (
              <Grid item xs={12} key={index}>
                <Typography variant="subtitle1">{field.fieldName}</Typography>
                <Typography>{field.fieldValue}</Typography>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Dialog>
  );
};

const renderInfo = (label: string, value: string | undefined | null) => (
  <Grid item xs={12} sm={6}>
    <Typography variant="subtitle1">{label}</Typography>
    <Typography>{value}</Typography>
  </Grid>
);

export default InfoCard;
