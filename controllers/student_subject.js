const dayjs = require('dayjs')
const Response = require('../utils/response')
const MSubjects = require('../models/m_subjects')
const MStudents = require('../models/m_students')
const UScheduleSubject = require('../models/u_schedule_subject')
const UStudentSubject = require('../models/u_student_subject')

const { QueryTypes, Op } = require('sequelize')
const sequelize = require('../config/database')
const subject = require('./subject')

class StudentSubject {
    async create(req, res) {
        try {
            // get raw data
            let data = { ...req.body }

            // check availability data
            const subject = await MSubjects.findOne({
                where: { code: data.subject_code }
            })
            const student = await MStudents.findOne({
                where: { nim: data.student_nim }
            })

            if (subject == null) {
                return Response.error(res, 404, 'Failed create student subject', 'Subject data not found!')
            }
            if (student == null) {
                return Response.error(res, 404, 'Failed create student subject', 'Student data not found!')
            }

            // check same value on u_student_subject
            const checkData = await UStudentSubject.findOne({
                where: { 
                    [Op.and]: [
                        { student_nim: data.student_nim },
                        { subject_code: data.subject_code },
                    ]
                }
            })

            if (checkData != null) {
                return Response.error(res, 400, 'Failed create student subject', 'Data already exists!')
            }

            // create u_student_subject
            const create = await UStudentSubject.create({
                student_nim: data.student_nim,
                subject_code: data.subject_code,
                created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss')
            })

            const response = {
                nim: create.student_nim,
                name: student.name,
                phone: student.phone,
                email: student.email,
                subject_code: subject.code,
                subject_name: subject.name,
                created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss')
            }
            
            return Response.success(res, 201, response, 'Success to create student subject')
        } catch (error) {
            return Response.error(res, 500, 'Failed create subject student', error.message)
        }
    }

    async update(req, res) {
        try {
            // get params
            let id = req.params.id

            // get raw data
            let data = { ...req.body }
            
            // check availability data
            const student = await MStudents.findOne({
                where: { nim: data.student_nim }
            })
            const subject = await MSubjects.findOne({
                where: { code: data.subject_code }
            })

            if (student == null) {
                return Response.error(res, 404, 'Failed update student subject', 'Student data not found!')
            }
            if (subject == null) {
                return Response.error(res, 404, 'Failed update student subject', 'Subject data not found!')
            }

            // update data
            await UStudentSubject.update({
                student_nim: data.student_nim,
                subject_code: data.subject_code,
                updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss')
            }, {
                where: { id: id }
            })
            
            const response = {
                nim: student.nim,
                name: student.name,
                phone: student.phone,
                email: student.email,
                subject_code: subject.code,
                subject_name: subject.name,
                created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss')
            }
            
            return Response.success(res, 200, response, 'Success to update student subject')
        } catch (error) {
            return Response.error(res, 500, 'Failed update subject student', error.message)
        }
    }

    async delete(req, res) {
        try {
            // get params
            let id = req.params.id

            // check availability data
            const check = await UStudentSubject.findOne({
                where: { id: id }
            })

            if (check == null) {
                return Response.error(res, 404, 'Failed update student subject', 'Data not found!')
            }

            // delete
            await UStudentSubject.destroy({
                where: { id: id }
            })
            
            return Response.success(res, 200, [], 'Success delete student subject')
        } catch (error) {
            return Response.error(res, 500, 'Failed delete subject student', error.message)
        }
    }
    
    /*
        table alias :
        a = u_student_subject (id, student_nim, subject_code)
        b = m_subjects (name)
        c = u_schedule_subject (day, start_time, end_time)
        d = u_lecturer_subject 
        e = m_lecturer (name)
    */
    async getSubjectStudentDetail(req, res) {
        try {
            // get students who was added to u_student_subject
            const students = await sequelize.query(
                'SELECT DISTINCT a.nim, a.name, a.phone, a.email FROM m_students a \
                INNER JOIN u_student_subject b ON a.nim = b.student_nim',
                { type: QueryTypes.SELECT }
            )

            // get student subject detail
            const studentSubject = await sequelize.query(
                'SELECT a.id as "id_student_subject", a.student_nim as "nim", \
                b.code as "subject_code", b.name as "subject_name", \
                c.day as "subject_day", c.start_time as "subject_start_time", \
                c.end_time as "subject_end_time", d.lecturer_nip, e.name as "lecturer_name" \
                FROM u_student_subject a \
                JOIN m_subjects b ON a.subject_code = b.code \
                JOIN u_schedule_subject c ON a.subject_code = c.subject_code \
                JOIN u_lecturer_subject d ON a.subject_code = d.subject_code \
                JOIN m_lecturer e ON d.lecturer_nip = e.nip', 
                { type: QueryTypes.SELECT }
            )

            let response = []

            students.map(student => {
                let data = {
                    nim: student.nim,
                    name: student.name,
                    phone: student.phone,
                    email: student.email,
                    subject: []
                }

                studentSubject.map(subject => {
                    if (student.nim == subject.nim) {
                        data.subject.push({
                            code: subject.subject_code,
                            name: subject.subject_name,
                            day: subject.subject_day,
                            start_time: subject.subject_start_time,
                            end_time: subject.subject_end_time,
                            lecturer: {
                                nip: subject.lecturer_nip,
                                name: subject.lecturer_name
                            }
                        })
                    }
                })

                response.push(data)
            })


            return Response.success(res, 200, response, 'Success fetch data')
        } catch(error) {
            return Response.error(res, 500, 'Failed get data subject', error.message)
        }
    }
}

module.exports = new StudentSubject()