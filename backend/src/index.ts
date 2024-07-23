import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import patientRoutes from "./routes/patientRoutes";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api", patientRoutes);

// Starting server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
