// @ts-nocheck
// @ts-nocheck
import { Request, Response } from 'express';
import { db } from '../db';
import { rides } from '../db/schema';
import { eq } from 'drizzle-orm';

export const requestRide = async (req: Request, res: Response) => {
  try {
    const { pickup, dropoff, fare } = req.body;
    const userId = (req as any).user.userId;
    const [newRide] = await db.insert(rides).values({ userId, pickupLocation: pickup, dropoffLocation: dropoff, fare }).returning();
    res.status(201).json({ success: true, data: newRide });
  } catch (error: any) { res.status(400).json({ success: false, message: error.message }); }
};
