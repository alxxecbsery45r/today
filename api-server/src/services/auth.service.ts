import jwt, { SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { config } from '../config';
import { db } from '../db';
import { refreshTokens } from '../db/schema';

export interface TokenPayload {
  userId: string;
  role: string;
  email: string;
}

export class AuthService {
  static generateAccessToken(payload: TokenPayload): string {
    const options: SignOptions = { 
      expiresIn: config.jwtAccessExpiry as any 
    };
    return jwt.sign(payload, config.jwtSecret, options);
  }

  static generateRefreshToken(): string {
    return crypto.randomBytes(64).toString('hex');
  }

  static verifyToken(token: string): TokenPayload | null {
    try {
      return jwt.verify(token, config.jwtSecret) as TokenPayload;
    } catch {
      return null;
    }
  }

  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  static async storeRefreshToken(userId: string, token: string, deviceInfo: string, ip: string) {
    await db.insert(refreshTokens).values({
      userId,
      token,
      deviceInfo,
      ipAddress: ip,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
  }
}
