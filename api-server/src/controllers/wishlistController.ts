// @ts-nocheck
// @ts-nocheck
import { Request, Response } from 'express';
import { db } from '../db';
import { wishlist, products } from '../db/schema';
import { eq, and } from 'drizzle-orm';

export const addToWishlist = async (req: Request, res: Response) => {
  try {
    const { productId } = req.body;
    const userId = (req as any).user.userId;

    const [item] = await db.insert(wishlist).values({ userId, productId }).returning();
    res.status(201).json({ success: true, data: item });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getMyWishlist = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const data = await db.select({
      id: wishlist.id,
      product: products
    })
    .from(wishlist)
    .innerJoin(products, eq(wishlist.productId, products.id))
    .where(eq(wishlist.userId, userId));
    
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
