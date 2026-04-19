import { db } from '../db';
import { otps } from '../db/schema';
import { eq, and } from 'drizzle-orm';

export class OtpService {
  static generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  static async sendOtp(phone: string) {
    const code = this.generateCode();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry

    await db.insert(otps).values({
      phone,
      code,
      expiresAt,
    });

    // Yahan SMS Gateway (like Twilio ya local PK gateway) ki API call aayegi
    console.log(`📱 OTP for ${phone}: ${code}`); 
    return code;
  }

  static async verifyOtp(phone: string, code: string): Promise<boolean> {
    const [record] = await db.select()
      .from(otps)
      .where(and(eq(otps.phone, phone), eq(otps.code, code)))
      .limit(1);

    if (!record || record.expiresAt < new Date()) return false;

    // Verify hone ke baad OTP delete kar den
    await db.delete(otps).where(eq(otps.id, record.id));
    return true;
  }
}
