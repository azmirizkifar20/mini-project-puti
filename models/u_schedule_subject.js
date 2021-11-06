const Sequelize = require('sequelize')
const db = require('../config/database')
const { DataTypes } = Sequelize

const UScheduleSubject = db.define('u_schedule_subject', {
    subject_code: {
        type: DataTypes.STRING
    },
    day: {
        type: DataTypes.STRING
    },
    start_time: {
        type: DataTypes.INTEGER
    },
    end_time: {
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

module.exports = UScheduleSubject