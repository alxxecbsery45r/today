// @ts-nocheck
// @ts-nocheck
import { Request, Response } from 'express';
import { db } from '../db';
import { reviews } from '../db/schema';
import { eq } from 'drizzle-orm';

export const addReview = async (req: Request, res: Response) => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = (req as any).user.userId;
    const [newReview] = await db.insert(reviews).values({
      userId, productId: productId as string, rating: rating.toString(), comment
    }).returning();
    res.status(201).json({ success: true, data: newReview });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getProductReviews = async (req: Request, res: Response) => {
  try {
    const productId = req.params.productId as string;
    const data = await db.select().from(reviews).where(eq(reviews.productId, productId));
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
