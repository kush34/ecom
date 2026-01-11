import mongoose from 'mongoose'
import { error } from 'node:console';

const connectDB = async ()=>{
    try {
        const db_URI  = process.env.db_URI;
        if(!db_URI){
            throw new error("db_URI missing in the env");
        }
        const connection = await mongoose.connect(db_URI);
        console.log(`Database connected`);
    } catch (error) {
        console.log(error);
    }
}

export default connectDB;