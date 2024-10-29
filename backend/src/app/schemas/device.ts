import { Device } from '@device-management/types';
import mongoose from 'mongoose';

export const DeviceSchema = new mongoose.Schema<Device>(
  {
    title: { type: String, required: true },
    serial: { type: String, required: true, unique: true },
    version: { type: Number, required: false },
    currentVersion: { type: Number, required: false },
    tags: { type: [String], default: [] },
    details: { type: mongoose.Schema.Types.Mixed, required: false },
    connectedAt: { type: Date, required: false },
  },
  {
    timestamps: true,
  },
);
