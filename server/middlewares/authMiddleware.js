// -----------------------------------------------------------------------------------------------------
// Authentication Middleware
// -----------------------------------------------------------------------------------------------------
const jwt = require('jsonwebtoken')

class authMiddleware {

    static isGuest(req, res, next) {
        const { authorization } = req.headers
        jwt.verify(authorization, process.env.SECRET, (err, token) => {
            if (err) return next()
            if (token) return res.status(401).send('verification failed !')
            return next()
        })
    }
    static isLogin(req, res, next) {
        checkToken(req, res, next)
    }
    static isUser(req, res, next) {
        checkToken(req, res, next, 'user')
    }
    static isAdmin(req, res, next) {
        checkToken(req, res, next, 'Admin')
    }
}
module.exports = authMiddleware;

function checkToken(req, res, next, role = null) {

    const { authorization } = req.headers
    if (!authorization) return res.status(401).send('verification failed, Token not found !')
    jwt.verify(authorization, process.env.SECRET, (err, token) => {
        if (err) return res.status(401).send('verification failed, verify token error !')
        if (!role) return next()
        if (token.role === role) return next()
        return res.status(401).send('verification failed !')
    })
}
