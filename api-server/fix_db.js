const { Client } = require('pg');
require('dotenv').config({ path: '.env.development' });

async function fix() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false } // Required for Neon
  });

  try {
    console.log("Connecting to Neon...");
    await client.connect();
    console.log("Dropping problematic tables...");
    await client.query('DROP TABLE IF EXISTS orders, products, rides, rider_profiles, flash_deals CASCADE;');
    console.log("✅ Success! Tables dropped.");
  } catch (err) {
    console.error("❌ Connection Error:", err.message);
  } finally {
    await client.end();
  }
}
fix();
