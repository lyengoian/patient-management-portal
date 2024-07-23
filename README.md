# Demo Patient Management Portal

## A Containerized Patient Management Portal with 
This project is a simple web application build with a React Frontend with Material UI components, and Express Backend with a PostgreSQL database, containerized with Docker. The application allows a user to sign up, log in, log out, and reset their password. Upon login, the user enters a patient management portal, where they will see a list of their current patients, as well as have the ability to add, edit, and remove any patients. Additionally, the user will be able to search for patients in the list. The user will be presented various error messages if any conflicts arise, such as trying to sign up with incorrect credentials, trying to sign up with duplicate emails, any errors from adding/removing/editing patients, and more.

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

### Logging In
2. From the landing page, simply enter the correct email and password combination and click on `Sign In`. You will need to create a user first if that email has not been registered yet.
   **NOTE** that the user will need to enter a valid email address and a password to sign in.

### Logging Out
3. From the patient management portal, simply click on the `Logout` button. You will then be redirected back to the landing page.

### Adding a Patient
4. From the patient management portal, simply click on the <> icon. A drawer will open, and a form will be presented to enter details about the new patient. Fill out all of the required information, then submit. Once the form is submitted, the drawer will close and the new patient will appear in the portal.
    **NOTE** that the user will need to fill out all required information for the form to submit. Additional fields and addresses can be added and removed as needed. At least one address is required for each patient.

### Editing a Patient
5. From the patient management portal, simply click on the <> icon. A drawer will open, and a form will be presented to enter updated information about the existing patient. All form fields will be pre-filled with any existing information. Fill out all of the required information as needed, then submit. Once the form is submitted, the drawer will close and the updated patient will appear in the portal.
    **NOTE** that the user will need to fill out all required information for the form to submit. Any fields that were not updated will be submitted as-is. Additional fields and addresses can be added and removed as needed. At least one address is required for each patient.

### Viewing Patient Information
6. From the patient management portal, simply click on the desired patient. A card will open, statically displaying all of the patient's information, organized by categories.

### Deleting a Patient
7. From the patient management portal, simply click on the <> icon. A dialog will open, asking to confirm the deletion action. Click on `Yes, Delete.` to delete the patient. Once the patient is successfully deleted, the dialog will close, and the patient will no longe appear in the portal.

**NOTE** that with all actions that make calls to the DB, error or success alerts will be shown to the user to confirm successful actions or notify that any errors have occured.

## Running the Application
Start by cloning the repository to your local machine. Open your Terminal and run the following command:

```
git clone https://github.com/lyengoian/finni-health
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
frontend-1  | You can now view my-react-app in the browser.
frontend-1  | 
frontend-1  |   Local:            http://localhost:3000
frontend-1  |   On Your Network:  http://<your-machine-ip>:3000
frontend-1  | 
frontend-1  | Note that the development build is not optimized.
frontend-1  | To create a production build, use npm run build.
```
You will now be able to access the application on http://localhost:3000

The React frontend was built with Create React App 
`npx create-react-app my-app --template typescript`
