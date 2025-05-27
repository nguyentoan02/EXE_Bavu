import express from "express";
import auth from "../middlewares/auth.middleware.js";
import {
    createAppointment,
    getAllAppointments,
    getAppointmentsByUserId,
    createDailyAppointment,
} from "../controllers/appointment.controller.js";
import { updateAppointmentStatus } from "../controllers/appointment.controller.js";

const router = express.Router();

router.post("/", auth, createAppointment);
router.patch("/:id/status", auth, updateAppointmentStatus);
router.get("/", auth, getAllAppointments);
router.get("/user", auth, getAppointmentsByUserId);
router.post("/daily", auth, createDailyAppointment);
export default router;
