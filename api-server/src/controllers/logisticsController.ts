// @ts-nocheck
// @ts-nocheck
import { Request, Response } from 'express';
import { db } from '../db';
import * as schema from '../db/schema';
import { eq } from 'drizzle-orm';

export const updateLiveLocation = async (req: Request, res: Response) => {
  try {
    const { lat, lng } = req.body;
    const userId = (req as any).user.userId;
    await db.update(schema.rider_profiles)
      .set({ currentLocation: `${lat},${lng}` })
      .where(eq(schema.rider_profiles.userId, userId));
    res.json({ success: true, message: "Location updated" });
  } catch (error: any) { 
    res.status(500).json({ success: false, message: error.message }); 
  }
};

export const assignRider = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.body;
    await db.update(schema.orders).set({ status: 'confirmed' }).where(eq(schema.orders.id, orderId));
    res.json({ success: true, message: "Order confirmed" });
  } catch (error: any) { 
    res.status(500).json({ success: false, message: error.message }); 
  }
};
