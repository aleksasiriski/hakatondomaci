//.env
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config()
}


const express = require("express")
const session = require("express-session")
const passport = require("passport")
const app = express()


const connectDB = require("./back/database/database")
connectDB()


app.set("view-engine", "ejs")
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.static("./front/static"))
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())


app.get("/", (req, res) => {
    res.render("../front/views/index.ejs")
})


const userViewRoute = require("./back/views/user")
app.use("/", userViewRoute)
const userRoute = require("./back/controller/user")
app.use("/api", userRoute)


const chatViewRoute = require("./back/views/chat")
app.use("/", chatViewRoute)
const chatRoute = require("./back/controller/chat")
app.use("/api", chatRoute)


const port = process.env.PORT
app.listen(port, () => {
    console.log("Listening on port: " + port)
})
