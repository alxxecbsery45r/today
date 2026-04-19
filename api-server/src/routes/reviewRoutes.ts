import { Router } from 'express';
import { addReview, getProductReviews } from '../controllers/reviewController';
import { authenticate } from '../middleware/rbac';
const router = Router();
router.post('/', authenticate, addReview);
router.get('/:productId', getProductReviews);
export default router;
