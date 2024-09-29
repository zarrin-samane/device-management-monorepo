import { User } from '@device-management/types';
import mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema<User>(
  {
    name: { type: String, required: false },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);
