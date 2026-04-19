// @ts-nocheck
// @ts-nocheck
import { Request, Response } from 'express';
import { db } from '../db';
import * as schema from '../db/schema';
import { eq } from 'drizzle-orm';

export const registerRider = async (req: Request, res: Response) => {
  try {
    const { vehicleType, licenseNumber } = req.body;
    const userId = (req as any).user.userId;
    const [profile] = await db.insert(schema.rider_profiles).values({ 
      userId, 
      vehicleType, 
      licenseNumber 
    }).returning();
    res.status(201).json({ success: true, data: profile });
  } catch (error: any) { 
    res.status(400).json({ success: false, message: error.message }); 
  }
};
