import { Router } from 'express';
import { transferMoney } from '../controllers/walletController';
import { submitKyc } from '../controllers/kycController';
import { updateLiveLocation, assignRider } from '../controllers/logisticsController';
import { authenticate, authorize } from '../middleware/rbac';

const router = Router();

router.post('/wallet/transfer', authenticate, transferMoney);
router.post('/kyc/submit', authenticate, submitKyc);
router.post('/logistics/track', authenticate, updateLiveLocation);
router.post('/logistics/assign', authenticate, authorize(['*']), assignRider);

export default router;
