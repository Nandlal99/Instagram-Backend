
const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect("mongodb+srv://nandlal:y9pZ58Wap3xLbbXC@cluster0.xgax1uu.mongodb.net/instagram?retryWrites=true&w=majority");
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
// password  y9pZ58Wap3xLbbXC
// mongodb+srv://nandlal:y9pZ58Wap3xLbbXC@cluster0.xgax1uu.mongodb.net/instagram?retryWrites=true&w=majority
// "mongodb+srv://nandlal:wvtbvkDhdmKiyzBy@cluster0.qaa1jk5.mongodb.net/instagramClone?retryWrites=true&w=majority"