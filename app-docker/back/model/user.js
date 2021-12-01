const mongoose = require("mongoose")
const passportLocalMongoose = require("passport-local-mongoose")


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    avatar: {
        type: String,
        default: ""
    },
    fname: {
        type: String,
        default: ""
    },
    lname: {
        type: String,
        default: ""
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    chats: [String],
    admin: {
        type: Boolean,
        default: false
    },
    createdAt: Date,
    updatedAt: Date
}, { collection: "users" })

userSchema.pre("save", function (next) {
    const currentDate = new Date()
    this.updatedAt = currentDate
    if (!this.createdAt)
        this.createdAt = currentDate
    next()
})


userSchema.plugin(passportLocalMongoose)
module.exports = mongoose.model("user", userSchema)