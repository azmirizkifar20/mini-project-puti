const express = require('express')
const router = express.Router()
const validate = require('../middlewares/validators')
const authRules = require('../middlewares/validators/rules/auth')
const otherRules = require('../middlewares/validators/rules/other')
const { protectAll, protectAdmin } = require('../middlewares/utility/auth')

const AuthController = require('../controllers/auth')
const SubjectController = require('../controllers/subject')
const StudentSubjectController = require('../controllers/student_subject')

// test protect route
router.get('/protect-test', protectAll, AuthController.testProtect)

// auth
router.post('/login', authRules.login, validate, AuthController.login)
router.post('/register-admin', authRules.registerAdmin, validate, AuthController.register)
router.post('/register-lecture', authRules.registerLecture, validate, AuthController.registerLecture)

// subject
router.get('/subjects', protectAll, SubjectController.getSubjectDetail)
router.delete('/subjects/:code', protectAdmin, SubjectController.delete)
router.post('/subjects', protectAdmin, otherRules.createSubject, validate, SubjectController.create)
router.put('/subjects/:code', protectAdmin, otherRules.createSubject, validate, SubjectController.update)

// student subject
router.get('/students/subject', protectAll, StudentSubjectController.getSubjectStudentDetail)
router.delete('/students/subject/:id', protectAdmin, StudentSubjectController.delete)
router.post('/students/subject', protectAdmin, otherRules.createStudentSubject, validate, StudentSubjectController.create)
router.put('/students/subject/:id', protectAdmin, otherRules.createStudentSubject, validate, StudentSubjectController.update)

module.exports = router