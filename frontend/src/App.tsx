import React, { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { ListItemAvatar, Avatar, Alert } from '@mui/material';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import AddPersonDialog from './AddPersonDialog';
import axios from 'axios';
import EditPersonDialog from './EditPersonDialog';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DeletePersonDialog from './DeletePersonDialog';
import { Patient, Status } from './types/types';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import InfoCard from './InfoCard';
import CloseIcon from '@mui/icons-material/Close';
import LoginForm from './Login';
import { getAuth, onAuthStateChanged, User, signOut } from 'firebase/auth';
import FinniHealthLogo from './logowhite.svg';

interface Props {
  window?: () => Window;
}

export default function App(props: Props) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [infoCardOpen, setInfoCardOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [statusError, setStatusError] = useState('');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let timer: string | number | NodeJS.Timeout | undefined;
    if (openError) {
      timer = setTimeout(() => {
        setOpenError(false);
      }, 3000);
    }
    if (openSuccess) {
      timer = setTimeout(() => {
        setOpenSuccess(false);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [openError, openSuccess]);

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = () => {
    axios.get('http://localhost:4000/api/patients')
      .then(response => {
        setPatients(response.data);
      })
      .catch(error => {
        setMessage('There was an error fetching the patients. Please try again.')
        setOpenError(true);
      });
  };

  const fetchStatuses = () => {
    axios.get('http://localhost:4000/api/statuses')
      .then(response => {
        setStatuses(response.data);
      })
      .catch(error => {
        setStatusError('There was an error fetching the statuses.')
      });
  };

  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number,
    patientId: number
  ) => {
    setSelectedIndex(index);
    setSelectedPatientId(patientId);
    setInfoCardOpen(true);
  };

  const handleListItemEditClick = (
    event: any,
    index: number,
    patientId: number
  ) => {
    setSelectedIndex(index);
    setSelectedPatientId(patientId);
    setDialogOpen(true);
    fetchStatuses();
  };

  const handleListItemDeleteClick = (
    event: any,
    index: number,
    patientId: number
  ) => {
    setSelectedIndex(index);
    setSelectedPatientId(patientId);
    setDeleteDialogOpen(true);
  };

  const handleAddPerson = () => {
    setAddDialogOpen(true);
    fetchStatuses();
  };

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth).then(() => {
      setUser(null);
      console.log('User signed out');
    }).catch((error) => {
      setOpenError(true);
      console.error('Error signing out:', error);
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {user ? (
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          <AppBar component="nav" sx={{ backgroundColor: '#DE7D41' }}>
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                sx={{ mr: 2, display: { sm: 'none' } }}
              >
                <MenuIcon />
              </IconButton>
              <img style={{ marginRight: '20px' }} src={FinniHealthLogo} alt="Finni Health Logo" />
              <Typography
                variant="h6"
                component="div"
                sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
              >
                Patient Management Portal
              </Typography>
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                <Button sx={{ color: '#fff' }} onClick={handleAddPerson}>
                  <PersonAddAltIcon />
                </Button>
                <Button sx={{ color: '#fff', marginLeft: 2 }} onClick={handleLogout}>
                  Logout
                </Button>
              </Box>
            </Toolbar>
          </AppBar>
          <Box component="main" sx={{ p: 3, width: '100%', backgroundColor: '#F0EADF', height: '100vh' }}>
            <Toolbar />
            {openSuccess && <Alert sx={{ margin: 'auto', marginBottom: 1, width: 'fit-content' }} severity="success" action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setOpenSuccess(false);
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }>{message}</Alert>}
            {openError && <Alert sx={{ margin: 'auto', marginBottom: 1, width: 'fit-content' }} severity="error" action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setOpenError(false);
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }>{message}</Alert>}
            <EditPersonDialog open={dialogOpen} setOpen={setDialogOpen} patientId={selectedPatientId} setSelectedIndex={setSelectedIndex} setOpenSuccess={setOpenSuccess} setOpenError={setOpenError} setMessage={setMessage} loadPatients={loadPatients} statuses={statuses} statusError={statusError}/>
            <AddPersonDialog open={addDialogOpen} setOpen={setAddDialogOpen} setOpenSuccess={setOpenSuccess} setOpenError={setOpenError} setMessage={setMessage} loadPatients={loadPatients} statuses={statuses} statusError={statusError}/>
            <DeletePersonDialog open={deleteDialogOpen} setOpen={setDeleteDialogOpen} patientId={selectedPatientId} setOpenSuccess={setOpenSuccess} setOpenError={setOpenError} setSelectedIndex={setSelectedIndex} setMessage={setMessage} loadPatients={loadPatients} />
            <InfoCard open={infoCardOpen} setOpen={setInfoCardOpen} patientId={selectedPatientId} setSelectedIndex={setSelectedIndex} />
            <List sx={{ width: '100%', maxWidth: '100%', bgcolor: 'background.paper', borderRadius: '15px', padding: '10px' }}>
              {patients.length > 0 ? patients.map((patient, index) => (
                <ListItem
                  sx={{ paddingRight: '7%' }}
                  key={patient.id}
                  secondaryAction={
                    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '5vw' }}>
                      <IconButton edge="end" aria-label="edit" onClick={(event) => handleListItemEditClick(event, index, patient.id)}>
                        <EditIcon sx={{
                          color: '#DE7D41',
                        }} />
                      </IconButton>
                      <IconButton edge="end" aria-label="delete" onClick={(event) => handleListItemDeleteClick(event, index, patient.id)}>
                        <DeleteIcon sx={{
                          color: '#913F3D',
                        }} />
                      </IconButton>
                    </Box>
                  }
                >
                  <ListItemButton
                    selected={selectedIndex === index}
                    onClick={(event) => handleListItemClick(event, index, patient.id)}
                  >
                    <ListItemAvatar>
                      <Avatar>
                        <PermIdentityIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${patient.first_name} ${patient.last_name}`}
                      secondary={new Date(patient.date_of_birth).toLocaleDateString()}
                    />
                  </ListItemButton>
                </ListItem>
              )) : (
                <Typography margin='auto' width='fit-content' color='primary' variant='h6'>Your patient dashboard is empty. Get started by adding new patients.</Typography>)}
            </List>
          </Box>
        </Box>
      ) : (<LoginForm />)}
    </ThemeProvider>
  );
}
