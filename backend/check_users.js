
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to DB');
    console.log('JWT_SECRET defined:', !!process.env.JWT_SECRET);
    const users = await User.find({}).select('+password');
    console.log('Users:', users.map(u => ({ email: u.email, hasPassword: !!u.password })));
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
