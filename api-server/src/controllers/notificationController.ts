// @ts-nocheck
// @ts-nocheck
import { Request, Response } from 'express';
import { db } from '../db';
import { notifications } from '../db/schema';
import { eq, desc } from 'drizzle-orm';

export const getMyNotifications = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const data = await db.select().from(notifications).where(eq(notifications.userId, userId)).orderBy(desc(notifications.createdAt));
    res.json({ success: true, data });
  } catch (error: any) { res.status(500).json({ success: false, message: error.message }); }
};

export const markAsRead = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await db.update(notifications).set({ isRead: true }).where(eq(notifications.id, id));
    res.json({ success: true, message: 'Read' });
  } catch (error: any) { res.status(500).json({ success: false, message: error.message }); }
};
