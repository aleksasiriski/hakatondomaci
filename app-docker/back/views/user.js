// includes
const { Router } = require("express")
const router = Router()
const check = require("../controller/authentication")

// users
router.get("/login", check.isNotAuthenticated, (req, res) => {
    res.render("../front/views/login.ejs")
})
router.get("/register", check.isNotAuthenticated, (req, res) => {
    res.render("../front/views/register.ejs")
})
router.get("/profile", check.isAuthenticated, (req, res) => {
    res.render("../front/views/profile.ejs")
})

// export
module.exports = router