import { Client } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.development' });

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log("💣 Connecting to DB to drop problematic tables...");
    await client.connect();
    // Dropping tables that have type conflicts
    await client.query('DROP TABLE IF EXISTS orders, products, rides, rider_profiles, flash_deals CASCADE;');
    console.log("✅ Tables dropped successfully.");
  } catch (err) {
    console.error("❌ Error dropping tables:", err);
  } finally {
    await client.end();
    process.exit(0);
  }
}

main();
