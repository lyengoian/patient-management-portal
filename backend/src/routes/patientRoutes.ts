import { Router } from "express";
import {
  getAllStatuses,
  createPatient,
  updatePatient,
  deletePatient,
  getAllPatients,
  getPatientById,
} from "../controllers/patientController";

const router = Router();

router.get("/statuses", getAllStatuses);
router.post("/patients", createPatient);
router.put("/patients/:id", updatePatient);
router.delete("/patients/:id", deletePatient);
router.get("/patients", getAllPatients);
router.get("/patients/:id", getPatientById);

export default router;
