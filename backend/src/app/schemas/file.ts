import { File } from '@device-management/types';
import mongoose from 'mongoose';

export const FileSchema = new mongoose.Schema<File>(
  {
    title: { type: String, required: true },
    path: { type: String, required: true },
    version: { type: Number, required: false, unique: true },
  },
  {
    timestamps: true,
  },
);
