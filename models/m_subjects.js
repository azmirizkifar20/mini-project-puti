const Sequelize = require('sequelize')
const db = require('../config/database')
const { DataTypes } = Sequelize

const MSubjects = db.define('m_subjects', {
    code: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    name: {
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

module.exports = MSubjects