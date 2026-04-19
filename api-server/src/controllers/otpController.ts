// @ts-nocheck
// @ts-nocheck
import { Request, Response } from 'express';
import { OtpService } from '../services/otp.service';
import { AuthService } from '../services/auth.service';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';

export const requestOtp = async (req: Request, res: Response) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ success: false, message: 'Phone required' });
    await OtpService.sendOtp(phone);
    res.json({ success: true, message: 'OTP sent' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyOtp = async (req: Request, res: Response): Promise<any> => {
  try {
    const { phone, code } = req.body;
    const isValid = await OtpService.verifyOtp(phone, code);
    if (!isValid) return res.status(400).json({ success: false, message: 'Invalid OTP' });

    const [user] = await db.select().from(users).where(eq(users.phone, phone)).limit(1);
    if (user) {
      const accessToken = AuthService.generateAccessToken({ userId: user.id, role: user.role, email: user.email });
      return res.json({ success: true, message: 'Logged in', accessToken, user });
    }
    res.json({ success: true, message: 'OTP verified, please register' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
