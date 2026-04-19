import { Router } from 'express';
import { placeOrder, getMyOrders, updateOrderStatus } from '../controllers/orderController';
import { authenticate, authorize } from '../middleware/rbac';

const router = Router();

router.post('/checkout', authenticate, placeOrder);
router.get('/my-orders', authenticate, getMyOrders);
router.patch('/status', authenticate, authorize(['*']), updateOrderStatus);

export default router;
