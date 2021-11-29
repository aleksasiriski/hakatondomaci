const mongoose = require("mongoose")
const passportLocalMongoose = require("passport-local-mongoose")

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    avatar: String,
    fname: String,
    lname: String,
    email: {
        type: String,
        unique: true
    },
    chats: [String],
    followedSubs: [String],
    moderatedSubs: [String],
    created: {
        subs: [String],
        themes: [String],
        comments: [String]
    },
    upvotes: {
        themes: [String],
        comments: [String]
    },
    downvotes: {
        themes: [String],
        comments: [String]
    },
    saved: {
        themes: [String],
        comments: [String]
    },
    admin: Boolean,
    createdAt: Date,
    updatedAt: Date
}, { collection: "users" })

userSchema.pre("save", function (next) {
    if (!this.admin)
        this.admin = false
    const currentDate = new Date()
    this.updatedAt = currentDate
    if (!this.createdAt)
        this.createdAt = currentDate
    if (!this.fname)
        this.fname = ""
    if (!this.lname)
        this.lname = ""
    if (!this.pfp)
        this.pfp = ""
    next()
})

userSchema.plugin(passportLocalMongoose)
module.exports = mongoose.model("user", userSchema)