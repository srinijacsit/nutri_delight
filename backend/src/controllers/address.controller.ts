import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { addressService } from '../services/address.service';
import { sendSuccess } from '../utils/response';
import { createAddressSchema, updateAddressSchema } from '../validators/user.validator';
import { ValidationError } from '../utils/errors';

export class AddressController {
  async getAddresses(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const addresses = await addressService.getAddresses(req.user!.id);
      return sendSuccess(res, addresses);
    } catch (error) {
      next(error);
    }
  }

  async createAddress(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const validatedData = createAddressSchema.parse(req.body);
      const address = await addressService.createAddress(req.user!.id, validatedData);
      return sendSuccess(res, address, 201);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return next(new ValidationError(error.errors[0].message));
      }
      next(error);
    }
  }

  async updateAddress(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const validatedData = updateAddressSchema.parse(req.body);
      const address = await addressService.updateAddress(req.user!.id, id, validatedData);
      return sendSuccess(res, address);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return next(new ValidationError(error.errors[0].message));
      }
      next(error);
    }
  }

  async deleteAddress(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      await addressService.deleteAddress(req.user!.id, id);
      return sendSuccess(res, null);
    } catch (error) {
      next(error);
    }
  }
}

export const addressController = new AddressController();
