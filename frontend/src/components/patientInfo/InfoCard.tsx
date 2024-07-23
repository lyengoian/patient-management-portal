import React, { useEffect, useState, useContext } from "react";
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
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { TransitionProps } from "@mui/material/transitions";
import axios from "axios";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { Address, Patient, Status } from "../../lib/types/types";
import { AppContext } from "../../lib/contexts/AppContext";
dayjs.extend(utc);

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const InfoCard: React.FC = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("AppContext must be used within an AppProvider");
  }

  const {
    infoCardOpen: open,
    setInfoCardOpen: setOpen,
    selectedPatientId: patientId,
    setSelectedIndex,
    statuses,
  } = context;

  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(
    undefined
  );
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [additionalFields, setAdditionalFields] = useState<any[]>([]);

  useEffect(() => {
    if (open && patientId) {
      axios
        .get(`http://localhost:4000/api/patients/${patientId}`)
        .then((response) => {
          const patient: Patient = response.data;
          setFirstName(patient.first_name);
          setMiddleName(patient.middle_name);
          setLastName(patient.last_name);
          setDateOfBirth(
            dayjs(patient.date_of_birth).utc().format("MM-DD-YYYY")
          );
          setSelectedStatus(
            statuses.find((status) => status.id === patient.status_id)
              ?.status_name
          );
          setAddresses(patient.addresses);
          setAdditionalFields(patient.additional_fields || []);
        })
        .catch((error) => {
          console.error("There was an error fetching the patient data.", error);
        });
    }
  }, [open, patientId, statuses]);

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
      scroll="paper"
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
          <Typography
            sx={{ ml: 2, flex: 1 }}
            variant="subtitle1"
            component="div"
          >
            Patient Details
          </Typography>
        </Toolbar>
      </AppBar>
      <Card sx={{ padding: 3, maxHeight: "70vh", overflow: "auto" }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Divider>
                <Typography variant="h6" color="primary">
                  Basic Information
                </Typography>
              </Divider>
            </Grid>
            {renderInfo("First Name", firstName)}
            {renderInfo("Middle Name", middleName)}
            {renderInfo("Last Name", lastName)}
            {renderInfo("Date of Birth", dateOfBirth)}
            {renderInfo("Status", selectedStatus)}
            <Grid item xs={12}>
              <Divider>
                <Typography variant="h6" color="primary">
                  Address
                </Typography>
              </Divider>
            </Grid>
            {addresses.map((address, index) => (
              <React.Fragment key={index}>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" color="primary">{`Address ${
                    index + 1
                  }`}</Typography>
                </Grid>
                {renderInfo("Address Line 1", address.addressLine1)}
                {renderInfo("Address Line 2", address.addressLine2)}
                {renderInfo("City", address.city)}
                {renderInfo("State", address.state)}
                {renderInfo("Zip Code", address.zipCode)}
              </React.Fragment>
            ))}
            <Grid item xs={12}>
              <Divider>
                <Typography variant="h6" color="primary">
                  Additional Fields
                </Typography>
              </Divider>
            </Grid>
            {additionalFields.map((field, index) => (
              <Grid item xs={12} key={index}>
                <Typography sx={{ fontWeight: "900" }} variant="subtitle1">
                  {field.fieldName}
                </Typography>
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
    <Typography sx={{ fontWeight: "900" }} variant="subtitle1">
      {label}
    </Typography>
    <Typography>{value}</Typography>
  </Grid>
);

export default InfoCard;
