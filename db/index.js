
const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect("mongodb://localhost:27017");
        console.log(`\n MongoDB connected !!`);
    } catch (error) {
        console.log("MONGODB connection FAILED ", error);
        process.exit(1)
    }
};

module.exports = connectDB;

// local mongodb server
// mongodb://localhost:27017

// mongodb altas server
// "mongodb+srv://nandlal:wvtbvkDhdmKiyzBy@cluster0.qaa1jk5.mongodb.net/instagramClone?retryWrites=true&w=majority"