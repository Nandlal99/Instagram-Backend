
const dotenv = require("dotenv");
const connectDB = require("./db/index");
const app = require("./app");
dotenv.config({
    path: "./.env"
})

connectDB()
    .then(() => {
        app.listen(3001, () => {
            console.log(` ⚙️  Server is running at port : 3001 \n I am building social media app like Instagram`);
        })
    })
    .catch((err) => {
        console.log("MONGO db connection failed !!! ", err);
    })
