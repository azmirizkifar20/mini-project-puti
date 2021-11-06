const Sequelize = require('sequelize')
const db = require('../config/database')
const { DataTypes } = Sequelize

const MStudents = db.define('m_students', {
    nim: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING
    },
    phone: {
        type: DataTypes.INTEGER
    },
    email: {
        type: DataTypes.INTEGER
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

module.exports = MStudents