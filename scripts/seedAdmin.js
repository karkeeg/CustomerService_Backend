const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();
const User = require('../models/userModel');
require('../database/connection');

const email = process.argv[2];

if (!email) {
  console.log('Please provide an email: node scripts/seedAdmin.js <email>');
  process.exit(1);
}

// Extract part before @ and add @
const username = email.split('@')[0];
let password = username + '@';

async function seedAdmin() {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User with this email already exists.');
      process.exit(0);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create Admin
    const user = await User.create({
      username: username,
      email: email,
      password: hashedPassword,
      role: 'admin',
      isVerified: true,
      isApproved: true
    });

    if (user) {
      console.log(`\n--- Admin Created ---`);
      console.log(`Email: ${user.email}`);
      console.log(`Password: ${password}`);
      console.log(`Role: ${user.role}`);
      console.log(`--------------------\n`);
      console.log('IMPORTANT: If your login fails, ensure your password meets the complexity requirements (uppercase, lowercase, number, etc.) on the login screen.');
    }
  } catch (err) {
    console.error('Error seeding admin:', err.message);
  } finally {
    mongoose.connection.close();
  }
}

seedAdmin();
