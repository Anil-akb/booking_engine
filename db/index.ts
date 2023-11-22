import mongoose from "mongoose";
import { DB_NAME } from "../utils/constant";

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI;
        // console.log(mongoURI)

        if (!mongoURI) {
            throw new Error("MONGODB_URI is not defined in the environment variables.");
        }

        const connectionInstance = await mongoose.connect(mongoURI, {
            dbName: DB_NAME, 
        });

        console.log(`⚙️ MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MONGODB connection FAILED ", error);
        process.exit(1);
    }
};

export default connectDB;
