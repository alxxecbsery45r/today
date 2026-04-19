import { Router } from 'express';
import { getDashboardStats } from '../controllers/adminController';
import { authenticate, authorize } from '../middleware/rbac';

const router = Router();
router.get('/stats', authenticate, authorize(['*']), getDashboardStats);

export default router;
