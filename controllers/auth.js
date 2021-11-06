const jwt = require('jsonwebtoken')
const passport = require('passport')
const Response = require('../utils/response')

const jwt_secret = process.env.JWT_SECRET_KEY

class Authentication {
    async login(req, res) {
        passport.authenticate('login', (err, user, info) => {
            if (err) {
                console.log(err);
                return Response.error(res, 500, 'Failed to register user', err)
            }
            if (info != undefined) {
                console.log(info.message)
                return Response.error(res, 500, 'Failed to register user', info.message)
            } else {
                // create jwt payload
                let payload = {
                    id: user.id,
                    username: user.username,
                    level: user.level
                }
                
                // sign jwt
                jwt.sign(payload, jwt_secret, {
                    algorithm: 'HS512',
                    expiresIn: '1d'
                }, (err, token) => {
                    if (err) {
                        return Response.error(res, 500, 'Failed to sign token', err)
                    } else {
                        // create response
                        const response = {
                            id: user.id,
                            username: user.username,
                            level: user.level == 1 ? 'admin' : 'lecture',
                            token: token
                        }
                        
                        return Response.success(res, 200, response, 'Success to register user!')
                    }
                })
            }
        })(req, res)
    }

    async register(req, res) {
        // get raw data
        var data = { ...req.body }

        if (data.password !== data.password_confirm) {
            return Response.error(res, 400, 'Failed to register user', 'Password confirm not match!')
        }

        // passport register
        passport.authenticate('register-admin', (err, user, info) => {
            if (err) {
                console.log(err);
                return Response.error(res, 500, 'Failed to register user', err)
            }
            if (info != undefined) {
                console.log(info.message)
                return Response.error(res, 500, 'Failed to register user', info.message)
            } else {
                // create jwt payload
                let payload = {
                    id: user.id,
                    username: user.username,
                    level: user.level
                }
                
                // sign jwt
                jwt.sign(payload, jwt_secret, {
                    algorithm: 'HS512',
                    expiresIn: '1d'
                }, (err, token) => {
                    if (err) {
                        return Response.error(res, 500, 'Failed to sign token', err)
                    } else {
                        // create response
                        const response = {
                            id: user.id,
                            username: user.username,
                            token: token
                        }
                        
                        return Response.success(res, 201, response, 'Success to register user!')
                    }
                })
            }
        })(req, res)
    }

    async registerLecture(req, res) {
        // get raw data
        var data = { ...req.body }

        if (data.password !== data.password_confirm) {
            return Response.error(res, 400, 'Failed to register user', 'Password confirm not match!')
        }

        // passport register
        passport.authenticate('register-lecture', (err, response, info) => {
            if (err) {
                console.log(err);
                return Response.error(res, 500, 'Failed to register user', err)
            }
            if (info != undefined) {
                console.log(info.message)
                return Response.error(res, 500, 'Failed to register user', info.message)
            } else {
                // create jwt payload
                let payload = {
                    id: response.id,
                    username: response.username,
                    level: response.level
                }
                
                // sign jwt
                jwt.sign(payload, jwt_secret, {
                    algorithm: 'HS512',
                    expiresIn: '1d'
                }, (err, token) => {
                    if (err) {
                        return Response.error(res, 500, 'Failed to sign token', err)
                    } else {
                        // create response
                        const sendResponse = {
                            id: response.id,
                            nip: response.nip,
                            username: response.username,
                            name: response.name,
                            token: token,
                            subject: response.subject
                        }
                        
                        return Response.success(res, 201, sendResponse, 'Success to register user!')
                    }
                })
            }
        })(req, res)
    }

    async testProtect(req, res) {
        return Response.success(res, 200, req.user)
    }
}

module.exports = new Authentication()