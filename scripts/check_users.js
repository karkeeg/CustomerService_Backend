require('dotenv').config();
require('./database/connection');
const userModel = require('./models/userModel');

async function checkRoles() {
  try {
    const users = await userModel.find({}, 'username email role');
    console.log('User roles in database:');
    users.forEach(u => {
      console.log(`User: ${u.username}, Email: ${u.email}, Role: ${u.role}`);
    });
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkRoles();
