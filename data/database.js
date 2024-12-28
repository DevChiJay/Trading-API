const mongoose = require('mongoose');

let mongodbUrl = 'mongodb://127.0.0.1:27017/trader';

if (process.env.MONGODB_URL) {
  mongodbUrl = process.env.MONGODB_URL;
}

async function initDatabase() {
  await mongoose.connect(mongodbUrl);
  console.log('connected!');
}

module.exports = initDatabase;
