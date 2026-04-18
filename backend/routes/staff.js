import { Router } from 'express';
import * as staffController from '../controllers/staff.js';
import { validate } from '../middleware/validate.js';
import { updateComplaintStatusSchema, addNoteSchema } from '../validators/complaintValidator.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';

const router = Router();

router.use(authenticate, authorize('STAFF'));

router.get('/complaints', staffController.getAssignedComplaints);
router.patch('/complaints/:id/status', validate(updateComplaintStatusSchema), staffController.updateStatus);
router.post('/complaints/:id/notes', validate(addNoteSchema), staffController.addNote);

export default router;
