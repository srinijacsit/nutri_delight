import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { cartService } from '../services/cart.service';
import { sendSuccess } from '../utils/response';
import { addCartItemSchema, updateCartItemSchema } from '../validators/cart.validator';
import { ValidationError } from '../utils/errors';

export class CartController {
  async getCart(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const cart = await cartService.getCart(req.user!.id);
      return sendSuccess(res, cart);
    } catch (error) {
      next(error);
    }
  }

  async addItem(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const validatedData = addCartItemSchema.parse(req.body);
      await cartService.addItem(
        req.user!.id, 
        validatedData.product_id, 
        validatedData.quantity, 
        validatedData.option_id
      );
      // Return updated cart
      const cart = await cartService.getCart(req.user!.id);
      return sendSuccess(res, cart, 201);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return next(new ValidationError(error.errors[0].message));
      }
      next(error);
    }
  }

  async updateItemQuantity(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const validatedData = updateCartItemSchema.parse(req.body);
      await cartService.updateItemQuantity(req.user!.id, id, validatedData.quantity);
      // Return updated cart
      const cart = await cartService.getCart(req.user!.id);
      return sendSuccess(res, cart);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return next(new ValidationError(error.errors[0].message));
      }
      next(error);
    }
  }

  async removeItem(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      await cartService.removeItem(req.user!.id, id);
      // Return updated cart
      const cart = await cartService.getCart(req.user!.id);
      return sendSuccess(res, cart);
    } catch (error) {
      next(error);
    }
  }

  async clearCart(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await cartService.clearCart(req.user!.id);
      const cart = await cartService.getCart(req.user!.id);
      return sendSuccess(res, cart);
    } catch (error) {
      next(error);
    }
  }
}

export const cartController = new CartController();
