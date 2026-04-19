#!/bin/bash

# Fix Upload Middleware
cat << 'INNER' > src/middleware/upload.ts
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './public/uploads';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + unique + path.extname(file.originalname));
  }
});

export const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const types = /jpeg|jpg|png|webp/;
    if (types.test(file.mimetype)) return cb(null, true);
    cb(new Error('Only images allowed!'));
  }
});
INNER

# Fix Product Routes
cat << 'INNER' > src/routes/productRoutes.ts
import { Router } from 'express';
import { createCategory, createProduct, getProducts } from '../controllers/productController';
import { authenticate, authorize } from '../middleware/rbac';
import { upload } from '../middleware/upload';

const router = Router();
router.post('/categories', authenticate, authorize(['*']), createCategory);
router.post('/', authenticate, authorize(['products:create']), upload.single('image'), createProduct);
router.get('/', getProducts);
export default router;
INNER

# Fix Product Controller
cat << 'INNER' > src/controllers/productController.ts
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
    const imageUrl = req.file ? \`/uploads/\${req.file.filename}\` : null;
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
    if (search) filters.push(ilike(products.name, \`%\${search}%\`));
    if (categoryId) filters.push(eq(products.categoryId, categoryId as string));
    const data = await db.select().from(products).where(and(...filters));
    res.json({ success: true, data });
  } catch (e: any) { res.status(500).json({ success: false, message: e.message }); }
};
INNER

# Fix Main Index.ts
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

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/otp', otpRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

app.post('/api/auth/register', authRateLimiter, async (req, res): Promise<any> => {
  const validation = registerSchema.safeParse(req.body);
  if (!validation.success) return res.status(400).json({ errors: validation.error.errors });
  const { email, phone, name, role, password } = validation.data;
  const existing = await db.select().from(users).where(eq(users.email, email));
  if (existing.length) return res.status(409).json({ error: 'User already exists' });
  const passwordHash = await AuthService.hashPassword(password);
  const [newUser] = await db.insert(users).values({ email, phone, name, role, passwordHash }).returning();
  const tokenPayload = { userId: newUser.id, role: newUser.role, email: newUser.email };
  const accessToken = AuthService.generateAccessToken(tokenPayload);
  return res.status(201).json({ accessToken, user: { id: newUser.id, email, name, role } });
});

app.post('/api/auth/login', authRateLimiter, async (req, res): Promise<any> => {
  const validation = loginSchema.safeParse(req.body);
  if (!validation.success) return res.status(400).json({ errors: validation.error.errors });
  const { email, password } = validation.data;
  const [user] = await db.select().from(users).where(eq(users.email, email));
  if (!user || !user.passwordHash) return res.status(401).json({ error: 'Invalid credentials' });
  const valid = await AuthService.comparePassword(password, user.passwordHash);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
  const tokenPayload = { userId: user.id, role: user.role, email: user.email };
  const accessToken = AuthService.generateAccessToken(tokenPayload);
  return res.json({ accessToken, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
});

app.get('/api/user/profile', authenticate, async (req, res): Promise<any> => {
  const [user] = await db.select().from(users).where(eq(users.id, req.user!.userId));
  if (!user) return res.status(404).json({ error: 'User not found' });
  return res.json({ id: user.id, email: user.email, name: user.name, role: user.role, phone: user.phone });
});

app.listen(config.port, () => {
  console.log(\`🚀 Server running on port \${config.port}\`);
});
INNER

echo "✅ All files fixed successfully!"
