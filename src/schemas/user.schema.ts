import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email(),
  phone: z.string().min(10),
  name: z.string().min(2),
  password: z.string().min(6),
  role: z.enum(['admin', 'vendor', 'rider', 'customer']).optional().default('customer'),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
