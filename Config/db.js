import mongoose from "mongoose";


const connectDB = async () => {
    try {
        const client = await mongoose.connect(process.env.Mongodb_url)
        if (client) {
            console.log("Database connected successfully");
        }

    }
    catch {
        console.log("Error in connecting to database");
    }
};
export default connectDB;