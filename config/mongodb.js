import mongoose from "mongoose";

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;
  
  // Check if placeholder
  if (!mongoUri || mongoUri.includes('your_')) {
    console.log("MONGO_URI not set - database features disabled");
    return false;
  }
  
  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 25000,
    });
    console.log("Database connected");
    return true;
  } catch (err) {
    console.log("DB error:", err.message);
    return false;
  }
};

export default connectDB;
export const isDbConnected = () => mongoose.connection.readyState === 1;
