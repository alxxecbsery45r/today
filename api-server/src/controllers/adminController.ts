import { Request, Response } from 'express';
import { db } from '../db';
import { orders, users, products } from '../db/schema';
import { sql } from 'drizzle-orm';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const [totalOrders] = await db.select({ count: sql`count(*)` }).from(orders);
    const [totalUsers] = await db.select({ count: sql`count(*)` }).from(users);
    const [totalProducts] = await db.select({ count: sql`count(*)` }).from(products);
    const [totalRevenue] = await db.select({ sum: sql`sum(CAST(total_amount AS DECIMAL))` }).from(orders);

    res.json({
      success: true,
      stats: {
        orders: totalOrders.count,
        users: totalUsers.count,
        products: totalProducts.count,
        revenue: totalRevenue.sum || 0
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
