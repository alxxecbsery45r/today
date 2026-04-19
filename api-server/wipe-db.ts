import { pool } from './src/db';
async function wipe() {
  const client = await pool.connect();
  try {
    console.log('Wiping database...');
    await client.query('DROP TABLE IF EXISTS "refresh_tokens", "audit_logs", "users" CASCADE;');
    console.log('✅ Database wiped successfully!');
  } catch (e) {
    console.error('❌ Error wiping DB:', e);
  } finally {
    client.release();
    process.exit();
  }
}
wipe();
