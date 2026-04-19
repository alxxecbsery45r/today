import { Request, Response, NextFunction } from 'express';
import { AuthService, TokenPayload } from '../services/auth.service';

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

const permissions: Record<string, string[]> = {
  admin: ['*'],
  vendor: ['products:read', 'products:create', 'products:update', 'orders:read'],
  rider: ['rides:read', 'rides:update', 'locations:update'],
  customer: ['orders:create', 'orders:read', 'profile:read', 'profile:update'],
};

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const token = authHeader.split(' ')[1];
  const payload = AuthService.verifyToken(token);
  if (!payload) return res.status(401).json({ error: 'Invalid token' });
  req.user = payload;
  next();
};

export const authorize = (required: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const userPerms = permissions[req.user.role] || [];
    const hasAccess = userPerms.includes('*') || required.every(p => userPerms.includes(p));
    if (!hasAccess) return res.status(403).json({ error: 'Forbidden' });
    next();
  };
};
