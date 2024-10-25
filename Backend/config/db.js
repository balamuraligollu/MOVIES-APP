import mongoose from "mongoose";

const configureDB = async () => {
    try {
        const db = await mongoose.connect(process.env.DB_URL);
        console.log("Connected to DB");
    } catch (err) {
        console.log('Failed to connect to DB', err);
    }
};

export default configureDB;
