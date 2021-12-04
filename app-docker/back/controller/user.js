const express = require("express")
const router = express()
const passport = require("passport")
const methodOverride = require("method-override")
const user = require("../model/user")
const check = require("./authentication")
const multer = require("multer")
const upload = multer({ dest: "front/static/uploads/" })
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const crypto = require('crypto');
const PASSWORD_LENGTH = 14;
const LOWERCASE_ALPHABET = 'abcdefghijklmnopqrstuvwxyz'; // 26 chars
const UPPERCASE_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; // 26 chars
const NUMBERS = '0123456789'; // 10 chars
const SYMBOLS = ',./<>?;\'":[]\\|}{=-_+`~!@#$%^&*()'; // 32 chars
const ALPHANUMERIC_CHARS = LOWERCASE_ALPHABET + UPPERCASE_ALPHABET + NUMBERS; // 62 chars
const ALL_CHARS = ALPHANUMERIC_CHARS + SYMBOLS; // 94 chars


passport.use(user.createStrategy())
passport.serializeUser(user.serializeUser())
passport.deserializeUser(user.deserializeUser())
router.use(methodOverride("_method"))


router.get("/authenticated", async (req, res) => {
    try {
        let success = false
        if (req.isAuthenticated()) {
            success = true
        }
        res.status(200).json({
            success: success
        })
    } catch (err) {
        res.status(404).json({
            success: false,
            message: err.message
        })
    }
})

router.post("/login", check.isNotAuthenticated, passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
}))

router.post("/register", check.isNotAuthenticated, async (req, res, next) => {
    try {
        const username = req.body.username
        const email = req.body.email
        const password = req.body.password

        const User = new user({
            username: username,
            email: email
        })
        await User.setPassword(password)
        await User.save()
        next()
    } catch {
        res.redirect("/register")
    }
}, passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
}))

router.delete("/logout", check.isAuthenticated, async (req, res) => {
    try {
        req.logOut()
        res.redirect("/")
    } catch {
        res.redirect("/")
    }
})

router.get("/username/:userId", async (req, res) => {
    try {
        const userId = req.params.userId
        if (userId == "self") {
            res.status(200).json({
                success: true,
                username: req.session.passport.user
            })
        } else {
            const specificUser = await user.findById(userId)
            res.status(200).json({
                success: true,
                username: specificUser.username
            })
        }
    } catch (err) {
        res.status(404).json({
            success: false,
            message: err.message
        })
    }
})

router.get("/userId/:username", async (req, res) => {
    try {
        const username = req.params.username
        if (username == "self") {
            const specificUser = await user.findOne({"username": `${req.session.passport.user}`})
            res.status(200).json({
                success: true,
                userId: specificUser._id
            })
        } else {
            const specificUser = await user.findOne({"username": `${username}`})
            res.status(200).json({
                success: true,
                userId: specificUser._id
            })
        }
    } catch (err) {
        res.status(404).json({
            success: false,
            message: err.message
        })
    }
})

router.get("/user", check.isAuthenticated, async (req, res) => {
    try {
        const specificUser = await user.findOne({"username": `${req.session.passport.user}`})
        res.status(200).json({
            success: true,
            user: specificUser
        })
    } catch (err) {
        res.status(404).json({
            success: false,
            message: err.message
        })
    }
})

router.put("/user", check.isAuthenticated, async (req, res) => {
    try {
        const fname = req.body.fname
        const lname = req.body.lname
        const email = req.body.email
        const password = req.body.password
        const specificUser = await user.findOne({"username": `${req.session.passport.user}`})
        let changed = false
        if (fname != "" && fname != null && fname != undefined) {
            specificUser.fname = fname
            changed = true
        }
        if (lname != "" && lname != null && lname != undefined) {
            specificUser.lname = lname
            changed = true
        }
        if (email != "" && email != null && email != undefined) {
            specificUser.email = email
            changed = true
        }
        if (password != "" && password != null && password != undefined) {
            await specificUser.setPassword(password)
            changed = true
        }
        if (changed) {
            await specificUser.save()
        }
        res.status(200).json({
            success: true
        })
    } catch (err) {
        res.status(404).json({
            success: false,
            message: err.message
        })
    }
})

router.put("/user/resetpassword", check.isAuthenticated, async (req, res) => {
    try {
        const specificUser = await user.findOne({"username": `${req.session.passport.user}`})
        const newPassword = generateRandomPassword(PASSWORD_LENGTH, ALL_CHARS)

        const msg = {
            to: specificUser.email,
            from: 'no-reply@tmina.org',
            subject: 'Password reset request',
            text: `Hello ${specificUser.fname},\n\nHere is your new password:\n\t${newPassword}`,
            html: `<strong>Hello ${specificUser.fname},\n\nHere is your new password:\n\t${newPassword}<strong>`,
        }

        sgMail
            .send(msg)
            .then((response) => {
                console.log(response[0].statusCode)
                console.log(response[0].headers)
            })
            .catch((error) => {
                console.error(error)
            })

        await specificUser.setPassword(newPassword)
        await specificUser.save()

        res.status(200).json({
            success: true
        })
    } catch (err) {
        res.status(404).json({
            success: false,
            message: err.message
        })
    }
})

function generateRandomPassword(length, alphabet) {
    let rb = crypto.randomBytes(length)
    let rp = ""
    for (let i = 0; i < length; i++) {
        rb[i] = rb[i] % alphabet.length
        rp += alphabet[rb[i]]
    }
    return rp
}


router.post("/user/avatar", upload.single("avatar"), async (req, res, next) => {
    try {
        const specificUser = await user.findOne({"username": `${req.session.passport.user}`})
        specificUser.avatar = req.file.filename
        await specificUser.save()
        res.redirect("/profile")
    } catch {
        res.redirect("/")
    }
})
router.delete("/user/avatar", upload.none(), async (req, res, next) => {
    try {
        const specificUser = await user.findOne({"username": `${req.session.passport.user}`})
        specificUser.avatar = ""
        await specificUser.save()
        res.redirect("/profile")
    } catch {
        res.redirect("/")
    }
})


module.exports = router
