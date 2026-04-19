import { Router } from 'express';
import { createCategory, createProduct, getProducts } from '../controllers/productController';
import { authenticate, authorize } from '../middleware/rbac';
import { upload } from '../middleware/upload';

const router = Router();
router.post('/categories', authenticate, authorize(['*']), createCategory);
router.post('/', authenticate, authorize(['products:create']), upload.single('image'), createProduct);
router.get('/', getProducts);
export default router;
