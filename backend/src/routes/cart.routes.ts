import { Router } from 'express';
import { cartController } from '../controllers/cart.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.use(requireAuth);
router.get('/', cartController.getCart);
router.post('/items', cartController.addItem);
router.patch('/items/:id', cartController.updateItemQuantity);
router.delete('/items/:id', cartController.removeItem);
router.delete('/', cartController.clearCart);

export default router;
