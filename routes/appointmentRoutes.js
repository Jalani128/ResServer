import express from "express";
import {
  scheduleViewing,
  getAllAppointments,
  updateAppointmentStatus,
  updateAppointmentMeetingLink,
  getAppointmentStats,
  submitAppointmentFeedback
} from "../controller/appointmentController.js";


const router = express.Router();

// Public appointment booking
router.post("/schedule", scheduleViewing);

// Admin routes (protected by adminProtect in adminRoutes or separate middleware?)
// These endpoints likely need admin protection - check if adminRoutes covers them?
// Actually these are under /api/appointments, they should be admin-only
router.get("/all", getAllAppointments);
router.get("/stats", getAppointmentStats);
router.put("/status", updateAppointmentStatus);
router.put("/update-meeting", updateAppointmentMeetingLink);
router.post("/feedback", submitAppointmentFeedback);

export default router;