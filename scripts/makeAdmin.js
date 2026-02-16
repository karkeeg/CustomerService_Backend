const mongoose = require('mongoose');
require('dotenv').config();
const User = require('../models/userModel');
require('../database/connection');

const email = process.argv[2];

if (!email) {
  console.log('Please provide an email: node scripts/makeAdmin.js <email>');
  process.exit(1);
}

async function makeAdmin() {
  try {
    const user = await User.findOneAndUpdate(
      { email: email },
      { role: 'admin', isVerified: true },
      { new: true }
    );

    if (user) {
      console.log(`Success! ${user.username} (${user.email}) is now an Admin.`);
    } else {
      console.log('User not found.');
    }
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    mongoose.connection.close();
  }
}

makeAdmin();
