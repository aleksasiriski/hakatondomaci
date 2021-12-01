const { Router } = require("express")
const router = Router()
const check = require("../controller/authentication")


router.get("/chats", check.isAuthenticated, (req, res) => {
    res.render("../front/views/chats.ejs")
})

router.get("/chat", check.isAuthenticated, (req, res) => {
    res.render("../front/views/chat.ejs")
})


module.exports = router