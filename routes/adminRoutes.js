import express from 'express';
import {
  createInquiry,
  getAllInquiries,
  getInquiryById,
  updateInquiryStatus,
  updateInquiryNotes,
  deleteInquiry,
} from '../controller/adminController.js';

import { adminProtect } from '../middleware/authMiddleware.js';
import { registry } from '../utils/circuitBreaker.js';

const router = express.Router();

// Apply admin authentication to ALL routes
router.use(adminProtect);

//
// 🔹 Inquiry Management
//
router.post('/inquiries', createInquiry);
router.get('/inquiries', getAllInquiries);
router.get('/inquiries/:id', getInquiryById);
router.put('/inquiries/:id/status', updateInquiryStatus);
router.put('/inquiries/:id/notes', updateInquiryNotes);
router.delete('/inquiries/:id', deleteInquiry);

//
// 🔹 Circuit Breaker Monitoring
//
router.get('/circuit-breakers', (req, res) => {
  try {
    const circuitBreakers = registry.getAll();

    res.json({
      success: true,
      circuitBreakers,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching circuit breaker status:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch circuit breaker status',
      error: error.message,
    });
  }
});

export default router;