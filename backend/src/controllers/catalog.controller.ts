import { Request, Response, NextFunction } from 'express';
import { catalogService } from '../services/catalog.service';
import { sendSuccess } from '../utils/response';

export class CatalogController {
  async getCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await catalogService.getCategories();
      return sendSuccess(res, categories);
    } catch (error) {
      next(error);
    }
  }

  async getProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const products = await catalogService.getProducts();
      return sendSuccess(res, products);
    } catch (error) {
      next(error);
    }
  }

  async getProductBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const slug = req.params.slug as string;
      const product = await catalogService.getProductBySlug(slug);
      return sendSuccess(res, product);
    } catch (error) {
      next(error);
    }
  }

  async getProductsByCategorySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const slug = req.params.slug as string;
      const products = await catalogService.getProductsByCategorySlug(slug);
      return sendSuccess(res, products);
    } catch (error) {
      next(error);
    }
  }
}

export const catalogController = new CatalogController();
