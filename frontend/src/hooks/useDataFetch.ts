import { useState, useEffect } from 'react';
import axios from 'axios';
import { Patient, Status } from '../lib/types/types';

const useDataFetch = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [statusError, setStatusError] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPatients = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/patients');
        setPatients(response.data);
      } catch (error) {
        setError('There was an error fetching the patients.');
      }
    };
    loadPatients();
  }, []);

  return { patients, statuses, statusError, error };
};

export default useDataFetch;
