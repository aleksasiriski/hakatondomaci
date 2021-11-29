const mongoose = require("mongoose")

const chatSchema = new mongoose.Schema({
    name: String,
    participants: [String],
    messages: [{
        sender: String,
        content: String,
        sentAt: Date,
        edited: Boolean
    }],
    createdAt: Date,
    updatedAt: Date
}, { collection: "chats" })

chatSchema.pre("save", function (next) {
    const currentDate = new Date()
    this.updatedAt = currentDate
    if (!this.createdAt)
        this.createdAt = currentDate
    next()
})

module.exports = mongoose.model("chat", chatSchema)