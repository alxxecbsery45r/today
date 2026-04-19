import { Request, Response } from 'express';
import { db } from '../db';
import { users } from '../db/schema';
import { AuthService } from '../services/auth.service';
import { eq } from 'drizzle-orm';

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, phone, name, password, role } = req.body;

    const hashedPassword = await AuthService.hashPassword(password);

    const [newUser] = await db.insert(users).values({
      email,
      phone,
      name,
      role: role || 'customer',
      passwordHash: hashedPassword,
    }).returning();

    res.status(201).json({ 
      success: true, 
      message: 'User created successfully', 
      userId: newUser.id 
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Signup failed' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (!user || !user.passwordHash || !(await AuthService.comparePassword(password, user.passwordHash))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const accessToken = AuthService.generateAccessToken({
      userId: user.id,
      role: user.role,
      email: user.email
    });

    const refreshToken = AuthService.generateRefreshToken();
    
    // Store refresh token in DB
    await AuthService.storeRefreshToken(
      user.id, 
      refreshToken, 
      req.headers['user-agent'] || 'unknown', 
      req.ip || 'unknown'
    );

    res.json({ 
      success: true,
      accessToken, 
      refreshToken,
      user: { id: user.id, name: user.name, role: user.role } 
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Login failed' });
  }
};
