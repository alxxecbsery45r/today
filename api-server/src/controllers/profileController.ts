// @ts-nocheck
// @ts-nocheck
import { Request, Response } from 'express';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { name, phone } = req.body;
    const [updated] = await db.update(users).set({ name, phone }).where(eq(users.id, userId)).returning();
    res.json({ success: true, data: updated });
  } catch (e: any) { res.status(400).json({ success: false, message: e.message }); }
};
