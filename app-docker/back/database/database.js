//.env
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config()
}


const mongoose = require("mongoose")


async function connectDB() {
    try {
        const url = process.env.URL_SECRET
        await mongoose.connect(url, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        })
        console.log("Connected to database")
    } catch (err) {
        console.log(`Error: ${err.message}`)
    }
}


module.exports = connectDB
