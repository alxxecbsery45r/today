import { Router } from 'express';
import { authenticate, authorize } from '../middleware/rbac';

const router = Router();

// Sab authenticated users ke liye (Customer, Vendor, Admin)
router.get('/profile', authenticate, (req, res) => {
  res.json({ success: true, user: req.user });
});

// Sirf Admin ke liye
router.get('/admin-dashboard', authenticate, authorize(['*']), (req, res) => {
  res.json({ success: true, message: 'Welcome to Admin Dashboard' });
});

// Sirf Vendor ke liye (Specific permission)
router.post('/products', authenticate, authorize(['products:create']), (req, res) => {
  res.json({ success: true, message: 'Product created successfully' });
});

export default router;
