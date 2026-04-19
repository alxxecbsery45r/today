import { Router } from 'express';
import { requestRide } from '../controllers/rideController';
import { authenticate } from '../middleware/rbac';
const router = Router();
router.post('/request', authenticate, requestRide);
export default router;
