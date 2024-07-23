import express from "express";
import { Pool } from "pg";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { Patient } from "./types";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST || "db",
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
});

pool.connect((err) => {
  if (err) {
    console.error("connection error", err.stack);
  } else {
    console.log("connected to the database");
  }
});

app.use(bodyParser.json());

// Get all status types
app.get("/api/statuses", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM statuses");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// Create a new patient
app.post("/api/patients", async (req, res) => {
  const {
    first_name,
    middle_name,
    last_name,
    date_of_birth,
    status_id,
    addresses,
    additional_fields,
  } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO patients (first_name, middle_name, last_name, date_of_birth) VALUES ($1, $2, $3, $4) RETURNING id",
      [first_name, middle_name, last_name, date_of_birth]
    );
    const patientId = result.rows[0].id;

    // Inserting id and status
    await pool.query(
      "INSERT INTO patient_status (patient_id, status_id) VALUES ($1, $2)",
      [patientId, status_id]
    );

    // Inserting address(es)
    for (const address of addresses) {
      const { addressLine1, addressLine2, city, state, zipCode } = address;
      if (addressLine1 && city && state && zipCode) {
        await pool.query(
          "INSERT INTO addresses (patient_id, address_line_1, address_line_2, city, state, zip_code) VALUES ($1, $2, $3, $4, $5, $6)",
          [patientId, addressLine1, addressLine2, city, state, zipCode]
        );
      }
    }

    // Inserting additional fields
    if (additional_fields && additional_fields.length > 0) {
      for (const field of additional_fields) {
        const { fieldName, fieldValue } = field;

        // Check if the field already exists to not add duplicate fields
        let fieldIdResult = await pool.query(
          "SELECT id FROM additional_fields WHERE field_name = $1",
          [fieldName]
        );

        let fieldId;
        if (fieldIdResult.rows.length > 0) {
          fieldId = fieldIdResult.rows[0].id;
        } else {
          fieldIdResult = await pool.query(
            "INSERT INTO additional_fields (field_name) VALUES ($1) RETURNING id",
            [fieldName]
          );
          fieldId = fieldIdResult.rows[0].id;
        }

        await pool.query(
          "INSERT INTO patient_additional_fields (patient_id, field_id, field_value) VALUES ($1, $2, $3)",
          [patientId, fieldId, fieldValue]
        );
      }
    }

    res.status(201).json({ message: "Patient added successfully", patientId });
  } catch (err) {
    console.error("Error details:", err);
    res.status(500).send("Server Error");
  }
});

// Updating patient info
app.put("/api/patients/:id", async (req, res) => {
  const { id } = req.params;
  const {
    first_name,
    middle_name,
    last_name,
    date_of_birth,
    status_id,
    addresses,
    additional_fields,
    removed_fields,
  } = req.body;

  try {
    await pool.query("BEGIN");

    await pool.query(
      `UPDATE patients SET first_name = $1, middle_name = $2, last_name = $3, date_of_birth = $4 WHERE id = $5`,
      [first_name, middle_name, last_name, date_of_birth, id]
    );

    // Updating status
    await pool.query(
      `UPDATE patient_status SET status_id = $1 WHERE patient_id = $2`,
      [status_id, id]
    );

    // Deleting current address(es)
    await pool.query(`DELETE FROM addresses WHERE patient_id = $1`, [id]);

    // Inserting new address(es)
    for (const address of addresses) {
      const { addressLine1, addressLine2, city, state, zipCode } = address;
      if (addressLine1 && city && state && zipCode) {
        await pool.query(
          "INSERT INTO addresses (patient_id, address_line_1, address_line_2, city, state, zip_code) VALUES ($1, $2, $3, $4, $5, $6)",
          [id, addressLine1, addressLine2, city, state, zipCode]
        );
      }
    }

    // Updating additional fields
    if (additional_fields && additional_fields.length > 0) {
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
            `INSERT INTO additional_fields (field_name) VALUES ($1) RETURNING id`,
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
    }

    // Removing any additional fields (that were requested to be removed)
    if (removed_fields && removed_fields.length > 0) {
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
    }

    await pool.query("COMMIT");
    res.send("Patient updated successfully");
  } catch (err) {
    await pool.query("ROLLBACK");
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// Deleting a patient
app.delete("/api/patients/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM patients WHERE id = $1", [id]);
    res.status(200).json({ message: "Patient deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// Get all patients
app.get("/api/patients", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.id, p.first_name, p.middle_name, p.last_name, p.date_of_birth, s.status_name,
             a.address_line_1, a.address_line_2, a.city, a.state, a.zip_code
      FROM patients p
      LEFT JOIN patient_status ps ON p.id = ps.patient_id
      LEFT JOIN statuses s ON ps.status_id = s.id
      LEFT JOIN addresses a ON p.id = a.patient_id
    `);

    const patients: { [key: number]: Patient } = {};

    result.rows.forEach((row) => {
      if (!patients[row.id]) {
        patients[row.id] = {
          id: row.id,
          first_name: row.first_name,
          middle_name: row.middle_name,
          last_name: row.last_name,
          date_of_birth: row.date_of_birth,
          status_name: row.status_name,
          addresses: [],
          additional_fields: [],
        };
      }
      patients[row.id].addresses.push({
        addressLine1: row.address_line_1,
        addressLine2: row.address_line_2,
        city: row.city,
        state: row.state,
        zipCode: row.zip_code,
      });
    });

    res.json(Object.values(patients));
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// Get a patient by ID
app.get("/api/patients/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const patientResult = await pool.query(
      `SELECT p.id, p.first_name, p.middle_name, p.last_name, 
              TO_CHAR(p.date_of_birth, 'YYYY-MM-DD') as date_of_birth,
              ps.status_id, s.status_name,
              a.address_line_1, a.address_line_2, a.city, a.state, a.zip_code
       FROM patients p
       LEFT JOIN patient_status ps ON p.id = ps.patient_id
       LEFT JOIN statuses s ON ps.status_id = s.id
       LEFT JOIN addresses a ON p.id = a.patient_id
       WHERE p.id = $1`,
      [id]
    );

    const patient: Patient = {
      id: patientResult.rows[0].id,
      first_name: patientResult.rows[0].first_name,
      middle_name: patientResult.rows[0].middle_name,
      last_name: patientResult.rows[0].last_name,
      date_of_birth: patientResult.rows[0].date_of_birth,
      status_id: patientResult.rows[0].status_id,
      status_name: patientResult.rows[0].status_name,
      addresses: patientResult.rows.map((row) => ({
        addressLine1: row.address_line_1,
        addressLine2: row.address_line_2,
        city: row.city,
        state: row.state,
        zipCode: row.zip_code,
      })),
      additional_fields: [],
    };

    const additionalFieldsResult = await pool.query(
      `SELECT af.field_name, paf.field_value
       FROM additional_fields af
       JOIN patient_additional_fields paf ON af.id = paf.field_id
       WHERE paf.patient_id = $1`,
      [id]
    );

    const additionalFields = additionalFieldsResult.rows.map((row) => ({
      fieldName: row.field_name,
      fieldValue: row.field_value,
    }));

    patient.additional_fields = additionalFields;

    res.json(patient);
  } catch (err) {
    console.error("Error fetching patient:", err);
    res.status(500).send("Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
