import { Router } from 'express';
import { signup, signin } from '../controllers/authController';
import { signupValidation, signinValidation } from '../middleware/validation';

const router = Router();

// POST /auth/signup
router.post('/signup', signupValidation, signup);

// POST /auth/signin
router.post('/signin', signinValidation, signin);

export default router;
