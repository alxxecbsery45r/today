import { Router } from 'express';
import { placeBid } from '../controllers/biddingController';
import { authenticate } from '../middleware/rbac';
const router = Router();
router.post('/rides/bid', authenticate, placeBid);
export default router;
