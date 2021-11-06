const Sequelize = require('sequelize')
const db = require('../config/database')
const { DataTypes } = Sequelize

const MUsers = db.define('m_users', {
    username: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING
    },
    level: {
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

module.exports = MUsers