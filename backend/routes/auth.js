import { Router } from 'express';
import * as authController from '../controllers/auth.js';
import { validate } from '../middleware/validate.js';
import { registerSchema, loginSchema, changePasswordSchema } from '../validators/authValidator.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/logout', authenticate, authController.logout);
router.post('/change-password', authenticate, validate(changePasswordSchema), authController.changePassword);
router.get('/me', authenticate, authController.getMe);

export default router;