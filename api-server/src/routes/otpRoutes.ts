import { Router } from 'express';
import { requestOtp, verifyOtp } from '../controllers/otpController';
import { authRateLimiter } from '../middleware/security';

const router = Router();

router.post('/request', authRateLimiter, requestOtp);
router.post('/verify', authRateLimiter, verifyOtp);

export default router;
