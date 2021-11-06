const Sequelize = require('sequelize')
const db = require('../config/database')
const { DataTypes } = Sequelize

const ULecturerSubject = db.define('u_lecturer_subject', {
    lecturer_nip: {
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

module.exports = ULecturerSubject