import express from 'express';
import { Pool } from 'pg';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST || 'db',
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
});

pool.connect(err => {
  if (err) {
    console.error('connection error', err.stack);
  } else {
    console.log('connected to the database');
  }
});

app.use(bodyParser.json());

// Get all statuses
app.get('/api/statuses', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM statuses');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Add a new patient
app.post('/api/patients', async (req, res) => {
  const { first_name, middle_name, last_name, date_of_birth, status_id, address, additional_fields } = req.body;
  
  try {
    // Insert new patient
    const result = await pool.query(
      'INSERT INTO patients (first_name, middle_name, last_name, date_of_birth) VALUES ($1, $2, $3, $4) RETURNING id',
      [first_name, middle_name, last_name, date_of_birth]
    );
    const patientId = result.rows[0].id;

    // Insert patient status
    await pool.query(
      'INSERT INTO patient_status (patient_id, status_id) VALUES ($1, $2)',
      [patientId, status_id]
    );

    // Insert patient address
    const { addressLine1, addressLine2, city, state, zipCode, country } = address;
    await pool.query(
      'INSERT INTO addresses (patient_id, address_line_1, address_line_2, city, state, zip_code, country) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [patientId, addressLine1, addressLine2, city, state, zipCode, country]
    );

    // Insert additional fields
    for (const field of additional_fields) {
      const { fieldName, fieldValue } = field;
      // Check if the field already exists
      let fieldIdResult = await pool.query(
        'SELECT id FROM additional_fields WHERE field_name = $1 AND field_type = $2',
        [fieldName]
      );

      let fieldId;
      if (fieldIdResult.rows.length > 0) {
        fieldId = fieldIdResult.rows[0].id;
      } else {
        // Insert new field definition
        fieldIdResult = await pool.query(
          'INSERT INTO additional_fields (field_name, field_type) VALUES ($1, $2) RETURNING id',
          [fieldName]
        );
        fieldId = fieldIdResult.rows[0].id;
      }

      // Insert patient additional field value
      await pool.query(
        'INSERT INTO patient_additional_fields (patient_id, field_id, field_value) VALUES ($1, $2, $3)',
        [patientId, fieldId, fieldValue]
      );
    }

    res.status(201).json({ message: 'Patient added successfully', patientId });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Update patient information
app.put('/api/patients/:id', async (req, res) => {
    const { id } = req.params;
    const {
      first_name,
      middle_name,
      last_name,
      date_of_birth,
      status_id,
      address,
      additional_fields,
      removed_fields,
    } = req.body;
  
    try {
      await pool.query('BEGIN');
  
      // Update patient basic info
      await pool.query(
        `UPDATE patients SET first_name = $1, middle_name = $2, last_name = $3, date_of_birth = $4 WHERE id = $5`,
        [first_name, middle_name, last_name, date_of_birth, id]
      );
  
      // Update patient status
      await pool.query(
        `UPDATE patient_status SET status_id = $1 WHERE patient_id = $2`,
        [status_id, id]
      );
  
      // Update patient address
      await pool.query(
        `UPDATE addresses SET address_line_1 = $1, address_line_2 = $2, city = $3, state = $4, zip_code = $5, country = $6 WHERE patient_id = $7`,
        [
          address.addressLine1,
          address.addressLine2,
          address.city,
          address.state,
          address.zipCode,
          address.country,
          id,
        ]
      );
  
      // Insert or update additional fields
      for (const field of additional_fields) {
        const existingField = await pool.query(
          `SELECT * FROM additional_fields WHERE field_name = $1`,
          [field.fieldName]
        );
  
        let fieldId;
        if (existingField.rows.length > 0) {
          fieldId = existingField.rows[0].id;
        } else {
          const newField = await pool.query(
            `INSERT INTO additional_fields (field_name, field_type) VALUES ($1, $2) RETURNING id`,
            [field.fieldName]
          );
          fieldId = newField.rows[0].id;
        }
  
        const existingPatientField = await pool.query(
          `SELECT * FROM patient_additional_fields WHERE patient_id = $1 AND field_id = $2`,
          [id, fieldId]
        );
  
        if (existingPatientField.rows.length > 0) {
          await pool.query(
            `UPDATE patient_additional_fields SET field_value = $1 WHERE patient_id = $2 AND field_id = $3`,
            [field.fieldValue, id, fieldId]
          );
        } else {
          await pool.query(
            `INSERT INTO patient_additional_fields (patient_id, field_id, field_value) VALUES ($1, $2, $3)`,
            [id, fieldId, field.fieldValue]
          );
        }
      }
  
      // Remove additional fields
      for (const field of removed_fields) {
        const fieldIdResult = await pool.query(
          `SELECT id FROM additional_fields WHERE field_name = $1`,
          [field.fieldName]
        );
        if (fieldIdResult.rows.length > 0) {
          const fieldId = fieldIdResult.rows[0].id;
          await pool.query(
            `DELETE FROM patient_additional_fields WHERE patient_id = $1 AND field_id = $2`,
            [id, fieldId]
          );
        }
      }
  
      await pool.query('COMMIT');
      res.send('Patient updated successfully');
    } catch (err) {
      await pool.query('ROLLBACK');
      console.error(err);
      res.status(500).send('Server Error');
    }
  });  

// Delete a patient
app.delete('/api/patients/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Delete patient
    await pool.query('DELETE FROM patients WHERE id = $1', [id]);

    res.status(200).json({ message: 'Patient deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Get all patients
app.get('/api/patients', async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT p.id, p.first_name, p.middle_name, p.last_name, p.date_of_birth, s.status_name, a.address_line_1, a.city, a.state, a.zip_code, a.country
        FROM patients p
        LEFT JOIN patient_status ps ON p.id = ps.patient_id
        LEFT JOIN statuses s ON ps.status_id = s.id
        LEFT JOIN addresses a ON p.id = a.patient_id
      `);
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  });
  
  // Get a patient by ID
  app.get('/api/patients/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const patientResult = await pool.query(
        `SELECT p.id, p.first_name, p.middle_name, p.last_name, p.date_of_birth,
                ps.status_id,
                a.address_line_1, a.address_line_2, a.city, a.state, a.zip_code, a.country
         FROM patients p
         LEFT JOIN patient_status ps ON p.id = ps.patient_id
         LEFT JOIN statuses s ON ps.status_id = s.id
         LEFT JOIN addresses a ON p.id = a.patient_id
         WHERE p.id = $1`, [id]);
  
      if (patientResult.rows.length === 0) {
        return res.status(404).send('Patient not found');
      }
  
      const patient = patientResult.rows[0];
  
      const additionalFieldsResult = await pool.query(
        `SELECT af.field_name, af.field_type, paf.field_value
         FROM additional_fields af
         JOIN patient_additional_fields paf ON af.id = paf.field_id
         WHERE paf.patient_id = $1`, [id]);
  
      const additionalFields = additionalFieldsResult.rows.map(row => ({
        fieldName: row.field_name,
        fieldValue: row.field_value,
      }));
  
      res.json({
        id: patient.id,
        first_name: patient.first_name,
        middle_name: patient.middle_name,
        last_name: patient.last_name,
        date_of_birth: patient.date_of_birth,
        status_id: patient.status_id,
        address: {
          addressLine1: patient.address_line_1,
          addressLine2: patient.address_line_2,
          city: patient.city,
          state: patient.state,
          zipCode: patient.zip_code,
          country: patient.country,
        },
        additional_fields: additionalFields,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  });