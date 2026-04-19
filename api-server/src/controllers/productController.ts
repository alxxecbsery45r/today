import { Request, Response } from 'express';
import { db } from '../db';
import { categories, products } from '../db/schema';
import { eq, ilike, and } from 'drizzle-orm';

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, description, slug } = req.body;
    const [cat] = await db.insert(categories).values({ name, description, slug }).returning();
    res.status(201).json({ success: true, data: cat });
  } catch (e: any) { res.status(400).json({ success: false, message: e.message }); }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { categoryId, name, description, price, stock } = req.body;
    const vendorId = (req as any).user.userId;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const [prod] = await db.insert(products).values({ 
      categoryId, vendorId, name, description, price, stock, imageUrl 
    }).returning();
    res.status(201).json({ success: true, data: prod });
  } catch (e: any) { res.status(400).json({ success: false, message: e.message }); }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { search, categoryId } = req.query;
    let filters = [];
    if (search) filters.push(ilike(products.name, `%${search}%`));
    if (categoryId) filters.push(eq(products.categoryId, categoryId as string));
    const data = await db.select().from(products).where(and(...filters));
    res.json({ success: true, data });
  } catch (e: any) { res.status(500).json({ success: false, message: e.message }); }
};
