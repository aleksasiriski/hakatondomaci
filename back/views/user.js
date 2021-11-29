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
router.get("/profile/createdSubs", check.isAuthenticated, (req, res) => {
    res.render("../front/views/createdSubs.ejs")
})
router.get("/profile/createdThemes", check.isAuthenticated, (req, res) => {
    res.render("../front/views/createdThemes.ejs")
})
router.get("/profile/upvotedThemes", check.isAuthenticated, (req, res) => {
    res.render("../front/views/upvotedThemes.ejs")
})
router.get("/profile/downvotedThemes", check.isAuthenticated, (req, res) => {
    res.render("../front/views/downvotedThemes.ejs")
})
router.get("/profile/savedThemes", check.isAuthenticated, (req, res) => {
    res.render("../front/views/savedThemes.ejs")
})

// export
module.exports = router