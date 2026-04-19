// @ts-nocheck
// @ts-nocheck
import { Request, Response } from 'express';
import { db } from '../db';
import { transactions, users } from '../db/schema';
import { eq, sql } from 'drizzle-orm';

export const getWalletData = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const history = await db.select().from(transactions).where(eq(transactions.userId, userId));
    
    const balanceQuery = sql`sum(CASE WHEN type = 'credit' THEN CAST(amount AS DECIMAL) ELSE -CAST(amount AS DECIMAL) END)`;
    
    const [balance] = await db.select({ total: balanceQuery })
      .from(transactions)
      .where(eq(transactions.userId, userId));

    res.json({ success: true, balance: balance?.total || 0, history });
  } catch (e: any) { 
    res.status(500).json({ success: false, message: e.message }); 
  }
};

export const transferMoney = async (req: Request, res: Response) => {
  try {
    const { receiverPhone, amount } = req.body;
    const senderId = (req as any).user.userId;

    const [receiver] = await db.select().from(users).where(eq(users.phone, receiverPhone)).limit(1);
    if (!receiver) throw new Error("Receiver not found");

    await db.transaction(async (tx) => {
      // Amount deduct from sender
      await tx.insert(transactions).values({ 
        userId: senderId, 
        amount: amount.toString(), 
        type: 'debit', 
        description: 'Sent to ' + receiverPhone 
      });
      // Amount add to receiver
      await tx.insert(transactions).values({ 
        userId: receiver.id, 
        amount: amount.toString(), 
        type: 'credit', 
        description: 'Received from sender' 
      });
    });

    res.json({ success: true, message: 'Transfer successful' });
  } catch (e: any) { 
    res.status(400).json({ success: false, message: e.message }); 
  }
};

export const deposit = async (req: Request, res: Response) => {
  try {
    const { amount, method } = req.body;
    const userId = (req as any).user.userId;
    await db.insert(transactions).values({ 
      userId, 
      amount: amount.toString(), 
      type: 'credit', 
      description: 'Top-up: ' + method 
    });
    res.json({ success: true, message: 'Balance added!' });
  } catch (e: any) { 
    res.status(400).json({ success: false, message: e.message }); 
  }
};
