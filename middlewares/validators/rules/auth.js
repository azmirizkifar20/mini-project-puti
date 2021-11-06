const { check } = require('express-validator')
const errorPassword = 'Password harus kombinasi huruf besar dan kecil, minimal 1 angka, minimal 1 karakter spesial dan panjang minimal 8 karakter'

module.exports = {
    login: [
        check('username').isLength({ min: 6 }),
        check('password', errorPassword).matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, "i"),
    ],
    registerAdmin: [
        check('username').isLength({ min: 6 }),
        check('password', errorPassword).matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, "i"),
        check('password_confirm', errorPassword).matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, "i")
    ],
    registerLecture: [
        check('nip').isNumeric(),
        check('name').isLength({ min: 6 }),
        check('subject_code').isAlphanumeric(),
        check('username').isLength({ min: 6 }),
        check('password', errorPassword).matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, "i"),
        check('password_confirm', errorPassword).matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, "i")
    ]
}