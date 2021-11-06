const passport = require('passport')
const Response = require('../../utils/response')

// protect all
exports.protectAll = async (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) {
            console.log(err);
            return Response.error(res, 403, 'Forbidden', err)
        }
        if (info != undefined) {
            console.log(info.message)
            return Response.error(res, 403, 'Forbidden', info.message)
        } else {
            req.user = user
            next()
        }
    })(req, res, next)
}

// protect admin
exports.protectAdmin = async (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) {
            console.log(err);
            return Response.error(res, 403, 'Forbidden', err)
        }
        if (info != undefined) {
            console.log(info.message)
            return Response.error(res, 403, 'Forbidden', info.message)
        } else {    
            if (user.level !== 1) {
                console.log('Only admin can access this route!')
                return Response.error(res, 403, 'Forbidden', 'Only admin can access this route!')
            }
            
            req.user = user
            next()
        }
    })(req, res, next)
}