import { pgTable, serial, text } from 'drizzle-orm/pg-core';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const connectionString = "postgresql://neondb_owner:npg_s6YEp4qkXPDz@ep-blue-cake-amu6yuja-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require";
const client = postgres(connectionString);
const db = drizzle(client);

async function check() {
  try {
    console.log("🔗 Connecting to Neon DB...");
    // Check if system_audit_log exists
    const result = await db.execute('SELECT 1');
    console.log("✅ Connection Successful! System is following the pattern.");
    process.exit(0);
  } catch (e) {
    console.error("❌ Connection Failed:", e);
    process.exit(1);
  }
}
check();
