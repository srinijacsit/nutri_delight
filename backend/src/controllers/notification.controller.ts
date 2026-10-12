import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { notificationService } from '../services/notification.service';
import { updateNotificationSchema } from '../validators/notification.validator';
import { sendSuccess } from '../utils/response';
import { AppError } from '../utils/errors';

export const getNotifications = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const notifications = await notificationService.getNotifications(userId);
    return sendSuccess(res, notifications);
  } catch (error) {
    next(error);
  }
};

export const updateNotification = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const notificationId = req.params.id as string;
    if (!notificationId) throw new AppError('Notification ID is required', 400, 'BAD_REQUEST');
    
    const validatedData = updateNotificationSchema.parse(req.body);
    const notification = await notificationService.markAsRead(userId, notificationId, validatedData.is_read);
    
    return sendSuccess(res, notification);
  } catch (error) {
    next(error);
  }
};
