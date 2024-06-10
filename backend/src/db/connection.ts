import { connect, disconnect} from "mongoose";

async function connectDatabase() {

    try {
        await connect(process.env.MONGODB_URL);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log('Cannot connect to mongoDB: ',error);
        throw new Error('Cannot connect to mongoDB');
    }
    
}

async function disconnectDatabase() {

    try {
        await disconnect();
    } catch (error) {
        console.log('Cannot disconnect from mongoDB: ', error);
        throw new Error('Cannot disconnect from mongoDB');
    }
    
}

export { connectDatabase, disconnectDatabase };