import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { profileService } from '../services/profile.service';
import { sendSuccess } from '../utils/response';
import { updateProfileSchema } from '../validators/user.validator';
import { ValidationError } from '../utils/errors';

export class ProfileController {
  async getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const profile = await profileService.getProfile(req.user!.id);
      return sendSuccess(res, profile);
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const validatedData = updateProfileSchema.parse(req.body);
      const profile = await profileService.updateProfile(req.user!.id, validatedData);
      return sendSuccess(res, profile);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return next(new ValidationError(error.errors[0].message));
      }
      next(error);
    }
  }
}

export const profileController = new ProfileController();
