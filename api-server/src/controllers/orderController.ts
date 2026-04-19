// @ts-nocheck
// @ts-nocheck
import { Request, Response } from 'express';
import { db } from '../db';
import { orders, orderItems, products } from '../db/schema';
import { eq, sql } from 'drizzle-orm';

export const placeOrder = async (req: Request, res: Response): Promise<any> => {
  try {
    const { items, totalAmount, address } = req.body;
    const userId = (req as any).user.userId;
    return await db.transaction(async (tx) => {
      const [newOrder] = await tx.insert(orders).values({ userId, totalAmount, address }).returning();
      for (const item of items) {
        const [prod] = await tx.select().from(products).where(eq(products.id, item.productId)).limit(1);
        if (!prod || parseInt(prod.stock) < item.quantity) throw new Error(`Stock out: ${prod?.name}`);
        await tx.update(products).set({ stock: sql`CAST(CAST(${products.stock} AS INTEGER) - ${item.quantity} AS TEXT)` }).where(eq(products.id, item.productId));
        await tx.insert(orderItems).values({ orderId: newOrder.id, productId: item.productId, quantity: item.quantity.toString(), price: item.price.toString() });
      }
      return res.status(201).json({ success: true, orderId: newOrder.id });
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getMyOrders = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = (req as any).user.userId;
    const userOrders = await db.select().from(orders).where(eq(orders.userId, userId));
    res.json({ success: true, data: userOrders });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateOrderStatus = async (req: Request, res: Response): Promise<any> => {
  try {
    const { orderId, status } = req.body; // status: 'confirmed', 'shipped', 'delivered', etc.
    await db.update(orders).set({ status }).where(eq(orders.id, orderId));
    res.json({ success: true, message: `Order status updated to ${status}` });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
