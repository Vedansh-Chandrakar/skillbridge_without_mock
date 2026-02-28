/**
 * Seed script — creates test users in MongoDB Atlas
 * Run: node src/seed/seedUsers.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const testUsers = [
  {
    name: 'Admin User',
    email: 'admin@skillbridge.com',
    password: 'admin123',
    type: 'admin',
    status: 'active',
    isVerified: true,
  },
  {
    name: 'Campus Admin',
    email: 'campus@skillbridge.com',
    password: 'campus123',
    type: 'campus',
    campus: 'MIT',
    status: 'active',
    isVerified: true,
  },
  {
    name: 'Student One',
    email: 'student@skillbridge.com',
    password: 'student123',
    type: 'student',
    campus: 'MIT',
    registeredModes: 'both',
    activeMode: 'freelancer',
    status: 'active',
    isVerified: true,
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Remove existing test users
    await User.deleteMany({ email: { $in: testUsers.map((u) => u.email) } });
    console.log('🗑️  Cleared existing test users');

    // Create users (pre-save hook will hash passwords)
    const created = await User.create(testUsers);
    console.log(`\n✅ Seeded ${created.length} test users:\n`);
    created.forEach((u) => console.log(`  • ${u.type.padEnd(8)} | ${u.email}  |  password: ${testUsers.find(t => t.email === u.email).password}`));

    console.log('\n🏁 Done.');
  } catch (err) {
    console.error('❌ Seed error:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
