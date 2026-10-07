import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import * as orderController from '../controllers/order.controller';

const router = Router();

router.use(requireAuth);

router.post('/normal', orderController.createNormalOrder);
router.post('/bulk', orderController.createBulkOrder);
router.get('/', orderController.getOrders);
router.get('/:id', orderController.getOrder);
router.get('/:id/bill', orderController.getOrderBill);

export default router;
