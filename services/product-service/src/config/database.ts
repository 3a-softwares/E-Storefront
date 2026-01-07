import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Logger } from '3a-ecommerce-utils/server';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';

export const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_URI);
    Logger.info('Connected to MongoDB successfully', undefined, 'Database');

    mongoose.connection.on('error', (err) => {
      Logger.error('MongoDB connection error', err, 'Database');
    });

    mongoose.connection.on('disconnected', () => {
      Logger.warn('MongoDB disconnected', undefined, 'Database');
    });
  } catch (error) {
    Logger.error('Failed to connect to MongoDB', error, 'Database');
    process.exit(1);
  }
};
