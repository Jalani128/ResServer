import express from 'express';
import { adminLogin } from '../controller/adminController.js';

const router = express.Router();

router.post('/login', adminLogin);
router.post('/admin', adminLogin);

export default router;