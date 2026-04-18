import { Router } from 'express';
import * as adminController from '../controllers/admin.js';
import { validate } from '../middleware/validate.js';
import { createStaffSchema, assignComplaintSchema } from '../validators/adminValidator.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';

const router = Router();

router.use(authenticate, authorize('ADMIN'));

router.post('/create-staff', validate(createStaffSchema), adminController.createStaff);
router.patch('/assign', validate(assignComplaintSchema), adminController.assignComplaint);
router.get('/analytics', adminController.getAnalytics);
router.get('/complaints', adminController.getAllComplaints);
router.get('/users', adminController.getAllUsers);
router.get('/logs', adminController.fetchLogs);

export default router;