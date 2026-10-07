import { Router } from 'express';
import { catalogController } from '../controllers/catalog.controller';

const router = Router();

router.get('/categories', catalogController.getCategories);
router.get('/products', catalogController.getProducts);
router.get('/products/:slug', catalogController.getProductBySlug);
router.get('/categories/:slug/products', catalogController.getProductsByCategorySlug);

export default router;
