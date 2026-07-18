import mongoose from 'mongoose';
import { ENV } from './env.js';
export const connectToDB = async (): Promise<void> => {
    const mongoURI = ENV.MONGODB_URI

    if (!mongoURI) {
        throw new Error("❌ MONGODB_URI is not defined in environment variables");
    }

    try {
        // Connect to MongoDB
        const connection = await mongoose.connect(mongoURI);

        console.log(`✅ MongoDB Connected: ${connection.connection.host}`);
    } catch (error: any) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);

        
        throw error;
    }
};