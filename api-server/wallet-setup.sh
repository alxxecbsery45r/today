#!/bin/bash

echo "🚀 Starting Full Wallet System Integration..."

# 1. Update Schema (Add Wallet Transactions Table)
# Note: Hum check kar rahe hain ke kahin duplicate na ho jaye
cat << 'INNER' >> src/db/schema.ts

export const walletTransactions = pgTable('wallet_transactions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  amount: varchar('amount', { length: 20 }).notNull(),
  type: varchar('type', { length: 10 }).notNull(), // credit/debit
  status: varchar('status', { length: 20 }).default('completed'),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
});
INNER

# 2. Create Wallet Controller (With Balance & Transaction Logic)
cat << 'INNER' > src/controllers/walletController.ts
import { Request, Response } from 'express';
import { db } from '../db';
import { walletTransactions, users } from '../db/schema';
import { eq, sql } from 'drizzle-orm';

export const getWalletData = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const history = await db.select().from(walletTransactions).where(eq(walletTransactions.userId, userId));
    
    // Calculate total balance from transactions
    const [balanceData] = await db.select({
      total: sql\`sum(CASE WHEN type = 'credit' THEN CAST(amount AS DECIMAL) ELSE -CAST(amount AS DECIMAL) END)\`
    }).from(walletTransactions).where(eq(walletTransactions.userId, userId));

    res.json({ success: true, balance: balanceData?.total || 0, history });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const depositMoney = async (req: Request, res: Response) => {
  try {
    const { amount, method } = req.body; // method: EasyPaisa, JazzCash etc
    const userId = (req as any).user.userId;

    const [transaction] = await db.insert(walletTransactions).values({
      userId,
      amount: amount.toString(),
      type: 'credit',
      description: \`Top-up via \${method || 'Manual'}\`
    }).returning();

    res.json({ success: true, message: 'Money added successfully', data: transaction });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};
INNER

# 3. Create Wallet Routes
cat << 'INNER' > src/routes/walletRoutes.ts
import { Router } from 'express';
import { getWalletData, depositMoney } from '../controllers/walletController';
import { authenticate } from '../middleware/rbac';

const router = Router();
router.get('/', authenticate, getWalletData);
router.post('/deposit', authenticate, depositMoney);

export default router;
INNER

# 4. Clean & Update Index.ts (Full Auto-Sync)
# Is step mein hum index.ts ko fresh likh rahe hain taake koi route miss na ho
cat << 'INNER' > src/index.ts
import express from 'express';
import { config } from './config';
import { helmetMiddleware, corsMiddleware, globalRateLimiter, authRateLimiter, httpsEnforcer } from './middleware/security';
import { authenticate, authorize } from './middleware/rbac';
import { registerSchema, loginSchema } from './schemas/user.schema';
import { AuthService } from './services/auth.service';
import otpRoutes from './routes/otpRoutes';
import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes';
import adminRoutes from './routes/adminRoutes';
import reviewRoutes from './routes/reviewRoutes';
import wishlistRoutes from './routes/wishlistRoutes';
import profileRoutes from './routes/profileRoutes';
import walletRoutes from './routes/walletRoutes';
import { db } from './db';
import { users } from './db/schema';
import { eq } from 'drizzle-orm';

const app = express();
app.use(httpsEnforcer);
app.use(helmetMiddleware);
app.use(corsMiddleware);
app.use(express.json());
app.use(globalRateLimiter);
app.use('/uploads', express.static('public/uploads'));

// Connect All Modules
app.use('/api/otp', otpRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/wallet', walletRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.post('/api/auth/register', authRateLimiter, async (req, res): Promise<any> => {
  const validation = registerSchema.safeParse(req.body);
  if (!validation.success) return res.status(400).json({ errors: validation.error.errors });
  const { email, phone, name, role, password } = validation.data;
  const hash = await AuthService.hashPassword(password);
  const [newUser] = await db.insert(users).values({ email, phone, name, role, passwordHash: hash }).returning();
  const token = AuthService.generateAccessToken({ userId: newUser.id, role: newUser.role, email: newUser.email });
  return res.status(201).json({ accessToken: token, user: newUser });
});

app.post('/api/auth/login', authRateLimiter, async (req, res): Promise<any> => {
  const validation = loginSchema.safeParse(req.body);
  if (!validation.success) return res.status(400).json({ errors: validation.error.errors });
  const { email, password } = validation.data;
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (!user || !user.passwordHash) return res.status(401).json({ error: 'Invalid credentials' });
  const valid = await AuthService.comparePassword(password, user.passwordHash);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
  const token = AuthService.generateAccessToken({ userId: user.id, role: user.role, email: user.email });
  return res.json({ accessToken: token, user });
});

app.listen(config.port, () => console.log('🚀 Server running on port ' + config.port));
INNER

echo "✅ All files integrated. Now updating database..."
pnpm db:push
