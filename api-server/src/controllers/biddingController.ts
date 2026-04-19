// @ts-nocheck
// @ts-nocheck
import { Request, Response } from 'express';
import { db } from '../db';
import { ride_bids } from '../db/schema';
import { eq } from 'drizzle-orm';

export const placeBid = async (req: any, res: any) => {
  try {
    const { rideId, amount } = req.body;
    const riderId = (req as any).user.userId;
    const [bid] = await db.insert(ride_bids).values({ rideId, riderId, bidAmount: amount.toString() }).returning();
    res.status(201).json({ success: true, data: bid });
  } catch (e) { res.status(400).json({ success: false, message: e.message }); }
};
