const { check } = require('express-validator')

module.exports = {
    createSubject: [
        check('subject_code').isAlphanumeric(),
        check('name').isLength({ min: 6 }),
        check('day').isAlphanumeric(),
        check('start_time').isLength({ min: 5 }),
        check('end_time').isLength({ min: 5 })
    ],
    createStudentSubject: [
        check('subject_code').isAlphanumeric(),
        check('student_nim').isAlphanumeric()
    ]
}