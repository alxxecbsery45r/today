import { Router } from 'express';
import { registerRider } from '../controllers/riderController';
import { authenticate } from '../middleware/rbac';

const router = Router();
router.post('/register', authenticate, registerRider);

export default router;
