import { Router } from 'express';
import { addressController } from '../controllers/address.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.use(requireAuth);
router.get('/', addressController.getAddresses);
router.post('/', addressController.createAddress);
router.patch('/:id', addressController.updateAddress);
router.delete('/:id', addressController.deleteAddress);

export default router;
