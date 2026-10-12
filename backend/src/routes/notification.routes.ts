import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import * as notificationController from '../controllers/notification.controller';

const router = Router();

router.use(requireAuth);

router.get('/', notificationController.getNotifications);
router.patch('/:id/read', notificationController.updateNotification);

export default router;
