import { Router } from 'express';
import { signup, signin, signout } from '../controllers/auth.controller';
import { validate } from '../middleware/validate';
import { signupSchema, signinSchema } from '../schemas/auth.schemas';
import { authenticateToken } from '../middleware/auth';

const router = Router();
router.post('/signup', validate(signupSchema), signup);
router.post('/signin', validate(signinSchema), signin);
router.post('/signout', authenticateToken, signout);

export default router;
