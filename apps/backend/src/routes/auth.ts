import { Router } from 'express';
import { signup, signin } from '../controllers/auth.controller';
import { validate } from '../middleware/validate';
import { signupSchema, signinSchema } from '../schemas/auth.schemas';

const router = Router();
router.post('/signup', validate(signupSchema), signup);
router.post('/signin', validate(signinSchema), signin);

export default router;
