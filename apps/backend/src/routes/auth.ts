import { Router } from 'express';
import { signup, signin } from '../controllers/auth.controller';
import { validateSchema } from '../middleware/validateSchema';
import { signupSchema, signinSchema } from '../schemas/auth.schemas';

const router = Router();

// POST /auth/signup
router.post('/signup', validateSchema(signupSchema), signup);

// POST /auth/signin
router.post('/signin', validateSchema(signinSchema), signin);

export default router;
