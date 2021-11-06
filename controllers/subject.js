const dayjs = require('dayjs')
const Response = require('../utils/response')
const MSubjects = require('../models/m_subjects')
const UScheduleSubject = require('../models/u_schedule_subject')

const { QueryTypes } = require('sequelize')
const sequelize = require('../config/database')

class Subject {
    async create(req, res) {
        try {
            // get raw data
            let data = { ...req.body }

            // check availability subject
            const subject = await MSubjects.findOne({
                where: { code: data.subject_code }
            })

            if (subject != null) {
                return Response.error(res, 400, 'Failed create subject', 'Subject data already exists!')
            }

            // create m_subject
            const createSubject = await MSubjects.create({
                code: data.subject_code,
                name: data.name,
                created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss')
            })

            // create u_schedule_subject
            const createSchedule = await UScheduleSubject.create({
                subject_code: createSubject.code,
                day: data.day,
                start_time: data.start_time,
                end_time: data.end_time,
                created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss')
            })

            const response = {
                subject: createSubject,
                schedule: createSchedule
            }

            return Response.success(res, 201, response, 'Success to create subject')
        } catch (error) {
            return Response.error(res, 500, 'Failed create subject', error.message)
        }
    }

    async update(req, res) {
        try {
            const subjectCode = req.params.code

            // get raw data
            let data = { ...req.body }

            // check availability subject
            const subject = await MSubjects.findOne({
                where: { code: subjectCode }
            })

            if (subject == null) {
                return Response.error(res, 404, 'Failed update subject', 'Data not found!')
            }

            // update m_subjects
            await MSubjects.update({
                code: data.subject_code,
                name: data.name,
                updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss')
            }, {
                where: { code: subjectCode }
            })
            await UScheduleSubject.update({
                subject_code: data.subject_code,
                day: data.day,
                start_time: data.start_time,
                end_time: data.end_time,
                updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss')
            }, {
                where: { subject_code: subjectCode }
            })

            const resultSubject = await MSubjects.findOne({
                where: { code: data.subject_code }
            })
            const resultSchedule = await UScheduleSubject.findOne({
                where: { subject_code: data.subject_code }
            })

            // create result
            const result = {
                subject: resultSubject,
                schedule: resultSchedule
            }

            return Response.success(res, 200, result, 'Success update subject')
        } catch(error) {
            return Response.error(res, 500, 'Failed create subject', error.message)
        }
    }

    async delete(req, res) {
        try {
            const subjectCode = req.params.code

            // check availability subject
            const subject = await MSubjects.findOne({
                where: { code: subjectCode }
            })

            if (subject == null) {
                return Response.error(res, 404, 'Failed update subject', 'Data not found!')
            }

            // delete m_subjects
            await MSubjects.destroy({
                where: { code: subjectCode }
            })

            return Response.success(res, 200, [], 'Success delete subject')
        } catch(err) {
            return Response.error(res, 500, 'Failed delete subject', error.message)
        }
    }

    async getSubjectDetail(req, res) {
        try {
            const response = await sequelize.query(
                'SELECT a.code, a.name, \
                b.day, b.start_time, b.end_time, \
                c.lecturer_nip, d.name as "lecturer_name" \
                FROM m_subjects a \
                JOIN u_schedule_subject b ON a.code = b.subject_code \
                JOIN u_lecturer_subject c ON b.subject_code = c.subject_code \
                JOIN m_lecturer d on c.lecturer_nip = d.nip', 
                { type: QueryTypes.SELECT }
            )

            return Response.success(res, 200, response, 'Success fetch data')
        } catch(error) {
            return Response.error(res, 500, 'Failed get data subject', error.message)
        }
    }
}

module.exports = new Subject()