import { Router } from 'express';
import { profileController } from '../controllers/profile.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.use(requireAuth);
router.get('/', profileController.getProfile);
router.patch('/', profileController.updateProfile);

export default router;
