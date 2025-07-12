import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const conn = mongoose.connect(process.env.MONGODB_URI);
        console.log(`mongodb connected  ${conn}` )
    }
    catch(error){
        console.error(error);
    }
}

export default connectDB;