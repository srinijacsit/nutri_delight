import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { orderService } from '../services/order.service';
import { createNormalOrderSchema, createBulkOrderSchema } from '../validators/order.validator';
import { sendSuccess } from '../utils/response';
import { AppError } from '../utils/errors';

export const createNormalOrder = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const validatedData = createNormalOrderSchema.parse(req.body);
    const order = await orderService.createNormalOrder(userId, validatedData);
    return sendSuccess(res, order, 201);
  } catch (error) {
    next(error);
  }
};

export const createBulkOrder = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const validatedData = createBulkOrderSchema.parse(req.body);
    const order = await orderService.createBulkOrder(userId, validatedData);
    return sendSuccess(res, order, 201);
  } catch (error) {
    next(error);
  }
};

export const getOrder = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const orderId = req.params.id as string;
    if (!orderId) throw new AppError('Order ID is required', 400, 'BAD_REQUEST');
    const order = await orderService.getOrder(userId, orderId);
    return sendSuccess(res, order);
  } catch (error) {
    next(error);
  }
};

export const getOrders = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const orders = await orderService.getOrders(userId);
    return sendSuccess(res, orders);
  } catch (error) {
    next(error);
  }
};

export const getOrderBill = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const orderId = req.params.id as string;
    if (!orderId) throw new AppError('Order ID is required', 400, 'BAD_REQUEST');
    const bill = await orderService.getBill(userId, orderId);
    return sendSuccess(res, bill);
  } catch (error) {
    next(error);
  }
};
