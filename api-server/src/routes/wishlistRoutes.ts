import { Router } from 'express';
import { addToWishlist, getMyWishlist } from '../controllers/wishlistController';
import { authenticate } from '../middleware/rbac';

const router = Router();
router.post('/', authenticate, addToWishlist);
router.get('/', authenticate, getMyWishlist);

export default router;
