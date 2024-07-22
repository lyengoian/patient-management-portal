import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { getAuth, onAuthStateChanged, signOut, User } from 'firebase/auth';
import axios from 'axios';
import { Patient, Status } from '../types/types';

interface AppContextProps {
  selectedIndex: number | null;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>;
  dialogOpen: boolean;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  infoCardOpen: boolean;
  setInfoCardOpen: React.Dispatch<React.SetStateAction<boolean>>;
  addDialogOpen: boolean;
  setAddDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  deleteDialogOpen: boolean;
  setDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  patients: Patient[];
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
  selectedPatientId: number | null;
  setSelectedPatientId: React.Dispatch<React.SetStateAction<number | null>>;
  openSuccess: boolean;
  setOpenSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  openError: boolean;
  setOpenError: React.Dispatch<React.SetStateAction<boolean>>;
  message: string | null;
  setMessage: React.Dispatch<React.SetStateAction<string | null>>;
  statuses: Status[];
  setStatuses: React.Dispatch<React.SetStateAction<Status[]>>;
  statusError: string;
  setStatusError: React.Dispatch<React.SetStateAction<string>>;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loadPatients: () => void;
  fetchStatuses: () => void;
  handleLogout: () => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
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
      setUser(user ? user : null);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
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
      .then(response => setPatients(response.data))
      .catch(() => {
        setMessage('There was an error fetching the patients. Please try again.');
        setOpenError(true);
      });
  };

  const fetchStatuses = () => {
    axios.get('http://localhost:4000/api/statuses')
      .then(response => setStatuses(response.data))
      .catch(() => {
        setStatusError('There was an error fetching the statuses.');
      });
  };

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => setUser(null))
      .catch(error => {
        setOpenError(true);
        console.error('Error signing out:', error);
      });
  };

  return (
    <AppContext.Provider value={{
      selectedIndex, setSelectedIndex,
      dialogOpen, setDialogOpen,
      infoCardOpen, setInfoCardOpen,
      addDialogOpen, setAddDialogOpen,
      deleteDialogOpen, setDeleteDialogOpen,
      patients, setPatients,
      selectedPatientId, setSelectedPatientId,
      openSuccess, setOpenSuccess,
      openError, setOpenError,
      message, setMessage,
      statuses, setStatuses,
      statusError, setStatusError,
      user, setUser,
      loadPatients, fetchStatuses, handleLogout
    }}>
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };
