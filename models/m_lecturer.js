const Sequelize = require('sequelize')
const db = require('../config/database')
const { DataTypes } = Sequelize

const MLecturer = db.define('m_lecturer', {
    nip: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING
    },
    id_m_users: {
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

module.exports = MLecturer