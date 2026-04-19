import { Router } from 'express';
import { getWalletData, deposit } from '../controllers/walletController';
import { authenticate } from '../middleware/rbac';

const router = Router();
router.get('/', authenticate, getWalletData);
router.post('/deposit', authenticate, deposit);

export default router;