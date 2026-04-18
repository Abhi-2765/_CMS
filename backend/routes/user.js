import { Router } from 'express';
import * as userController from '../controllers/user.js';
import { validate } from '../middleware/validate.js';
import { createComplaintSchema } from '../validators/complaintValidator.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';
import { upload } from '../middleware/upload.js';

const router = Router();

// Endpoints for Users
router.use(authenticate);

// We need authorize('USER') to block STAFF/ADMIN from submitting complaints for themselves?
// Or maybe any role can submit a complaint. Let's allow ANY role to get their own complaints.

router.post('/', upload.single('image'), validate(createComplaintSchema), userController.createComplaint);
router.get('/', userController.getMyComplaints);
router.get('/:id', userController.getComplaint);

export default router;