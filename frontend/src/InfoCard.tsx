import React, { useEffect, useState } from 'react';
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
import { Address, InfoCardProps, Patient, Status } from './types/types';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const InfoCard: React.FC<InfoCardProps> = ({ open, setOpen, patientId, setSelectedIndex }) => {
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [address, setAddress] = useState<Address>({ addressLine1: '', addressLine2: '', city: '', state: '', zipCode: '', country: '' });
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
          console.error('There was an error fetching the patient data!', error);
        });
    }
  }, [patientId]);

  const handleClose = () => {
    setSelectedIndex(null);
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Dialog
        fullWidth
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative', backgroundColor:'#DE7D41'}}>
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
          <Card sx={{padding:3}}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Typography variant="subtitle1">First Name</Typography>
                  <Typography>{firstName}</Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="subtitle1">Middle Name</Typography>
                  <Typography>{middleName}</Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="subtitle1">Last Name</Typography>
                  <Typography>{lastName}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1">Date of Birth</Typography>
                  <Typography>{dateOfBirth}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1">Status</Typography>
                  <Typography>
                    {statuses.find(status => status.id.toString() === selectedStatus)?.status_name}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1">Address Line 1</Typography>
                  <Typography>{address.addressLine1}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1">Address Line 2</Typography>
                  <Typography>{address.addressLine2}</Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="subtitle1">City</Typography>
                  <Typography>{address.city}</Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="subtitle1">State</Typography>
                  <Typography>{address.state}</Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="subtitle1">Zip Code</Typography>
                  <Typography>{address.zipCode}</Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="subtitle1">Country</Typography>
                  <Typography>{address.country}</Typography>
                </Grid>
                {additionalFields && additionalFields.length > 0 && additionalFields.map((field, index) => (
                  <Grid item xs={12} key={index}>
                    <Typography variant="subtitle1">{field.fieldName}</Typography>
                    <Typography>{field.fieldValue}</Typography>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
      </Dialog>
    </React.Fragment>
  );
};

export default InfoCard;
