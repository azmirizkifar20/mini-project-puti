const { validationResult } = require('express-validator');

/**
 * Middleware that applies express validator on the validation rules.
 *
 * @param {object} req The request object
 * @param {object} res The response object
 * @param {func} next The next function
 * @returns next function if there's no error and the error object if there's a validation error
 */

module.exports = function validate (req, res, next) {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        return next()
    }

    // const extractedErrors = []
    // errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))
    return res.status(422).json({ errors: errors.array() })
}
