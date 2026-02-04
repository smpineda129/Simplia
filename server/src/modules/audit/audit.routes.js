import { Router } from 'express';
import { getEvents, exportExcel, exportPdf } from './audit.controller.js';
import { authenticate } from '../../middlewares/auth.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/', getEvents);
router.get('/export/excel', exportExcel);
router.get('/export/pdf', exportPdf);

export default router;
