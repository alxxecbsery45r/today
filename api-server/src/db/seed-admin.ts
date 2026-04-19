// @ts-nocheck
const { Client } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.development' });

const seedAdmin = async () => {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  const adminEmail = 'admin@ajkmart.com';
  const adminPass = 'Admin@AJK123';

  try {
    await client.connect();
    console.log('🚀 Connecting to Neon DB for Admin Seeding...');

    const hashedPass = await bcrypt.hash(adminPass, 10);
    
    // Pehle purana admin delete (taakay fresh create ho identity columns ke saath)
    await client.query('DELETE FROM users WHERE email = $1', [adminEmail]);

    // Naya Admin insert
    await client.query(
      'INSERT INTO users (name, email, password, role, wallet_balance) VALUES ($1, $2, $3, $4, $5)',
      ['AJK Master Admin', adminEmail, hashedPass, 'admin', '1000.00']
    );

    console.log('\n✅ --- ADMIN ACCOUNT READY ---');
    console.log('📧 Email: ' + adminEmail);
    console.log('🔑 Password: ' + adminPass);
    console.log('🛡️ Role: admin');
    console.log('-------------------------------\n');

  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await client.end();
  }
};

seedAdmin();
