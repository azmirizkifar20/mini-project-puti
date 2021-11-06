const Sequelize = require('sequelize')
const db = require('../config/database')
const { DataTypes } = Sequelize

const UStudentSubject = db.define('u_student_subject', {
    student_nim: {
        type: DataTypes.STRING
    },
    subject_code: {
        type: DataTypes.STRING
    },
    created_at: {
        type: DataTypes.STRING
    },
    updated_at: {
        type: DataTypes.STRING
    }
}, {
    freezeTableName: true
})

module.exports = UStudentSubject