import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config()

const connectDB = async () => {
    try { 
        await mongoose.connect(process.env.MONGO_URL);
        console.log("✅ Database connected successfully");
    } catch (e) {
        console.error("❌ Something went wrong in database:", e.message);
    }
};
export default connectDB;