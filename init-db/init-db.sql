CREATE TABLE patients (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL
);

CREATE TABLE statuses (
    id SERIAL PRIMARY KEY,
    status_name VARCHAR(50) UNIQUE NOT NULL
);

INSERT INTO statuses (status_name) VALUES ('Inquiry'), ('Onboarding'), ('Active'), ('Churned');

CREATE TABLE patient_status (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL,
    status_id INTEGER NOT NULL,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (status_id) REFERENCES statuses(id)
);

CREATE TABLE addresses (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL,
    address_line_1 VARCHAR(255) NOT NULL,
    address_line_2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    zip_code VARCHAR(20) NOT NULL,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);

CREATE TABLE additional_fields (
    id SERIAL PRIMARY KEY,
    field_name VARCHAR(100) NOT NULL
);

CREATE TABLE patient_additional_fields (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL,
    field_id INTEGER NOT NULL,
    field_value TEXT NOT NULL,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (field_id) REFERENCES additional_fields(id) ON DELETE CASCADE
);
