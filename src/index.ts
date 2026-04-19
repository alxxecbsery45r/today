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

app.use('/api/otp', otpRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/profile', profileRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.post('/api/auth/register', authRateLimiter, async (req, res): Promise<any> => {
  const validation = registerSchema.safeParse(req.body);
  if (!validation.success) return res.status(400).json({ errors: validation.error.errors });
  const { email, phone, name, role, password } = validation.data;
  const passwordHash = await AuthService.hashPassword(password);
  const [newUser] = await db.insert(users).values({ email, phone, name, role, passwordHash }).returning();
  const token = AuthService.generateAccessToken({ userId: newUser.id, role: newUser.role, email: newUser.email });
  return res.status(201).json({ accessToken: token, user: newUser });
});

app.post('/api/auth/login', authRateLimiter, async (req, res): Promise<any> => {
  const validation = loginSchema.safeParse(req.body);
  if (!validation.success) return res.status(400).json({ errors: validation.error.errors });
  const { email, password } = validation.data;
  const [user] = await db.select().from(users).where(eq(users.email, email));
  if (!user || !user.passwordHash) return res.status(401).json({ error: 'Invalid credentials' });
  const valid = await AuthService.comparePassword(password, user.passwordHash);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
  const token = AuthService.generateAccessToken({ userId: user.id, role: user.role, email: user.email });
  return res.json({ accessToken: token, user });
});

app.get('/api/user/profile', authenticate, async (req, res): Promise<any> => {
  const [user] = await db.select().from(users).where(eq(users.id, req.user!.userId));
  return res.json(user);
});

app.listen(config.port, () => console.log(`🚀 Server running on port ${config.port}`));
