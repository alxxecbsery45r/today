import { Router } from 'express';
import { updateProfile } from '../controllers/profileController';
import { authenticate } from '../middleware/rbac';
const router = Router();
router.put('/update', authenticate, updateProfile);
export default router;
