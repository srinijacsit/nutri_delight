import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { sendError } from '../utils/response';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[Error]:', err.message);

  if (err instanceof AppError) {
    return sendError(res, err.message, err.code, err.statusCode);
  }

  // Fallback for unhandled errors
  return sendError(res, 'Internal Server Error', 'INTERNAL_SERVER_ERROR', 500);
};
