function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    } else {
        return res.redirect('/login')
    }
}

function isNotAuthenticated(req, res, next) {
    if (!req.isAuthenticated()) {
        return next()
    } else {
        return res.redirect('/')
    }
}

module.exports = {isAuthenticated, isNotAuthenticated}