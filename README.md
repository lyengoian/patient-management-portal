# Patient Management Portal

This project is a web application built with a React Frontend with Material UI components, and Express Backend with a PostgreSQL database, containerized with Docker. The application allows a user to sign up, log in, log out, and reset their password before managing their patients. Upon login, the user enters a patient management portal, where they will see a list of their current patients, as well as have the ability to add, edit, and remove any patients. Additionally, the user will be able to search for patients from the list. The user will be presented various error messages if any conflicts arise, such as trying to sign up with incorrect credentials or any errors from adding/removing/editing patients, and more.

- [How to Use](#how-to-use)
  - [Authentication](#signing-up)
  - [Patient Management](#patient-managemenet-portal)
  - [Search](#filteringsearching-patients)
- [Running the Application](#running-the-application)

## Built With / Technologies Used
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![MUI](https://img.shields.io/badge/MUI-%230081CB.svg?style=for-the-badge&logo=mui&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white)
![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)
![Firebase](https://img.shields.io/badge/firebase-a08021?style=for-the-badge&logo=firebase&logoColor=ffcd34)
![Visual Studio Code](https://img.shields.io/badge/Visual%20Studio%20Code-0078d7.svg?style=for-the-badge&logo=visual-studio-code&logoColor=white)

## How to Use

### Signing Up
1. From the landing page, simply click on `Sign Up` and enter an email address and password. If a user has already signed up with that email address, you will not be able to recreate one and will have to sign in instead.
   **NOTE** that the user will need to enter a valid email address and a password with at least 6 characters to sign up.
#### Sign Up Page
<img width="1501" alt="image" src="https://github.com/user-attachments/assets/213274f2-e2c6-435e-b8a4-e868fdb4e538">

#### Successful Sign Up
<img width="1501" alt="image" src="https://github.com/user-attachments/assets/c6c1393c-7bdc-4967-9af4-0fc92339171b">

### Signing In
2. From the landing page, simply enter the correct email and password combination and click on `Sign In`. You will need to create a user first if that email has not been registered yet.
   **NOTE** that the user will need to enter a valid email address and a password to sign in.
#### Sign In Page
<img width="1501" alt="image" src="https://github.com/user-attachments/assets/a089d039-9fbd-47e8-98b6-e930b9683ac7">

### Resetting Password
2. From the landing page, simply click on `Forgot Password?`, enter the correct email, and click on `Send Reset Email`. 
   **NOTE** that a password reset email will only be sent if the user exists.
#### Password Reset Email Page
<img width="1501" alt="image" src="https://github.com/user-attachments/assets/204daa94-05fa-409f-ad32-c6c951c6692e">

#### Password Reset Email Successfully Sent
<img width="1501" alt="image" src="https://github.com/user-attachments/assets/e5dc68ee-2dc4-47cf-8d90-206b50651c5f">

#### Password Reset Email
<img width="1177" alt="image" src="https://github.com/user-attachments/assets/51bd97e0-f100-4d84-a7cb-8fc5329ff930">
<img width="436" alt="image" src="https://github.com/user-attachments/assets/e8ff2736-a753-4550-94a3-d11a850eab7a">

### Logging Out
3. From the patient management portal, simply click on the `Logout` button. You will then be redirected back to the landing page.

### Patient Managemenet Portal
<img width="1501" alt="image" src="https://github.com/user-attachments/assets/57d66377-ec31-4f50-8c06-a3a2eb5fa807">

### Adding a Patient
4. From the patient management portal, simply click on the <img width="38" alt="image" src="https://github.com/user-attachments/assets/4298fb3b-96a2-4ba4-8742-8edece10658f">
 icon. A drawer will open, and a form will be presented to enter details about the new patient. Fill out all of the required information, then submit. Once the form is submitted, the drawer will close and the new patient will appear in the portal.
    **NOTE** that the user will need to fill out all required information for the form to submit. Additional fields and addresses can be added and removed as needed. At least one address is required for each patient.
#### Empty Add Patient Form
<img width="1508" alt="image" src="https://github.com/user-attachments/assets/779ec6a2-5ca2-465b-bef9-b1beb4696c8d">

#### Successful Creation of New Patient
<img width="1501" alt="image" src="https://github.com/user-attachments/assets/b52c097e-4695-439e-9cdb-367ba4f83aba">

### Editing a Patient
5. From the patient management portal, simply click on the <img width="38" alt="image" src="https://github.com/user-attachments/assets/650e83b0-098b-422d-b604-1f20d069c36b">
 icon. A drawer will open, and a form will be presented to enter updated information about the existing patient. All form fields will be pre-filled with any existing information. Fill out all of the required information as needed, then submit. Once the form is submitted, the drawer will close and the updated patient will appear in the portal.
    **NOTE** that the user will need to fill out all required information for the form to submit. Any fields that were not updated will be submitted as-is. Additional fields and addresses can be added and removed as needed. At least one address is required for each patient.
#### Edit Patient Form with Pre-Filled Information
<img width="1505" alt="image" src="https://github.com/user-attachments/assets/69b7126e-1034-46bc-81be-788b16f1f181">

#### Successful Update of Patient
<img width="1501" alt="image" src="https://github.com/user-attachments/assets/85073633-d3e6-4597-8cc2-9a932723159e">

### Viewing Patient Information
6. From the patient management portal, simply click on the desired patient. A scrollable card will open, statically displaying all of the patient's information, organized by categories.
#### Scrollable Patient Information Card
<img width="1501" alt="image" src="https://github.com/user-attachments/assets/70b45c35-0a9e-4113-a6e0-375f60d7b5f9">
<img width="1501" alt="image" src="https://github.com/user-attachments/assets/72768f4d-5b47-4496-82fb-2c303db7e31a">

### Deleting a Patient
7. From the patient management portal, simply click on the <img width="38" alt="image" src="https://github.com/user-attachments/assets/174bc5b1-a29a-4a7c-8cce-2ba2542e49ce">
 icon. A dialog will open, asking to confirm the deletion action. Click on `Yes, Delete.` to delete the patient. Once the patient is successfully deleted, the dialog will close, and the patient will no longe appear in the portal.
#### Delete Patient Confirmation Dialog
<img width="1501" alt="image" src="https://github.com/user-attachments/assets/16ffebfd-8d01-4926-98f8-d1512efca7b4">

#### Successful Deletion of Patient
<img width="1501" alt="image" src="https://github.com/user-attachments/assets/304b5ddd-fa64-4897-b488-92afc41c5b56">

### Filtering/Searching Patients
7. From the patient management portal, simply start typing search criteria. You can search for patients based on any criteria, such as name, date of birth, zip code, additional fields, etc. Multiple filters can be applied by separating each with a semicolon (;).
#### Filtering by State
<img width="1501" alt="image" src="https://github.com/user-attachments/assets/0c0be07d-7161-4bad-b2c1-897d34a195e1">

#### Filtering by State and Last Name
<img width="1501" alt="image" src="https://github.com/user-attachments/assets/a53c60d2-8a31-40a0-9803-f4753082cac7">

#### Filtering by State, Last Name, and Additional Field called "weight"
<img width="1501" alt="image" src="https://github.com/user-attachments/assets/6228197a-68b8-45d4-8873-f4278d65d0f6">

#### Filtering by Status
<img width="1501" alt="image" src="https://github.com/user-attachments/assets/4885b2f3-34e4-4d0d-8f38-12f5f89054ea">

**NOTE** that with all actions that make calls to the DB, error or success alerts will be shown to the user to confirm successful actions or notify that any errors have occured.

## Running the Application
Start by cloning the repository to your local machine. Open your Terminal and run the following command:

```
git clone https://github.com/lyengoian/patient-management-portal
```

The best way to run this project is by building the docker container. Before running the application, ensure Docker Desktop is installed and running on your machine. 

From the root directory, run the following command in the Terminal:

```
docker-compose up --build
```

This will build the frontend and backend, set up the PostgresSQL database and create all necessary tables based on `init-db.sql`, as well as install all necessary packages and dependencies.

Once Docker compose finishes running, you will see the following in the console:
```
frontend-1  | Compiled successfully!
frontend-1  | 
frontend-1  | You can now view patient-management-portal in the browser.
frontend-1  | 
frontend-1  |   Local:            http://localhost:3000
frontend-1  |   On Your Network:  http://<your-machine-ip>:3000
```
You will now be able to access the application on http://localhost:3000

The React frontend was built with Create React App 
`npx create-react-app my-app --template typescript`
