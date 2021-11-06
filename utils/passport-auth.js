const dayjs = require('dayjs')
const bcrypt = require('bcrypt')
const BCRYPT_SALT_ROUNDS = 12

const localStrategy = require('passport-local').Strategy,
    JWTstrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt

const MUsers = require('../models/m_users')
const MSubjects = require('../models/m_subjects')
const MLecturer = require('../models/m_lecturer')
const ULecturerSubject = require('../models/u_lecturer_subject')

// login
const loginStrategy = new localStrategy(
    {
        usernameField: 'username',
        passwordField: 'password',
        session: false
    },
    async (username, password, done) => {
        try {
            console.log('masuk passport');
            // check m_users
            const user = await MUsers.findOne({
                where: { username: username }
            })

            if (user == null) {
                console.log('wrong username/password!')
                return done(null, false, { message: 'wrong username/password!' })
            } else {
                const compare = await bcrypt.compare(password, user.password)

                if (!compare) {
                    console.log('wrong username/password!')
                    return done(null, false, { message: 'wrong username/password!' })
                }

                return done(null, user)
            }
        } catch (err) {
            done(err)
        }
    }
)

// register admin
const registerAdminStrategy = new localStrategy(
    {
        usernameField: 'username',
        passwordField: 'password',
        session: false
    },
    async (username, password, done) => {
        try {
            const user = await MUsers.findOne({
                where: { username: username }
            })
            
            // check data
            if (user != null) {
                console.log('username already exists')
                return done(null, false, { message: 'username already exists' })
            } else {
                // encrypt password
                const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS)

                MUsers.create({
                    username: username,
                    password: hashedPassword,
                    level: 1,
                    created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss')
                })
                    .then(user => {
                        console.log('User created!')
                        return done(null, user)
                    })
            }
        } catch (err) {
            done(err)
        }
    }
)

// register lecturer
const registerLecturerStrategy = new localStrategy(
    {
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true,
        session: false
    },
    async (req, username, password, done) => {
        try {
            // raw data
            var data = { ...req.body }

            // check m_users
            const user = await MUsers.findOne({
                where: { username: username }
            })
            // check m_subjects
            const subject = await MSubjects.findOne({
                where: { code: data.subject_code }
            })
            // check m_lecturer
            const lecture = await MLecturer.findOne({
                where: { nip: data.nip }
            })

            // check data
            if (user != null) {
                console.log('username already exists')
                return done(null, false, { message: 'username already exists' })
            } else if (subject == null) {
                console.log('subject code not found!')
                return done(null, false, { message: 'subject code not found!' })
            } else if (lecture != null) {
                console.log('lecture data already exists')
                return done(null, false, { message: 'lecture data already exists' })
            } else {
                // encrypt password
                const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS)

                const createUser = await MUsers.create({
                    username: username,
                    password: hashedPassword,
                    level: 2,
                    created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss')
                })
                console.log('User created!')

                // create m_lecturer
                const createLecture = await MLecturer.create({
                    nip: data.nip,
                    name: data.name,
                    id_m_users: createUser.id,
                    created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss')
                })
                console.log('Lecture created!')

                // create u_lecturer_subject
                await ULecturerSubject.create({
                    lecturer_nip: createLecture.nip,
                    subject_code: data.subject_code,
                    created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss')
                })

                let response = {
                    id: createUser.id,
                    username: createUser.username,
                    level: createUser.level,
                    nip: createLecture.nip,
                    name: createLecture.name,
                    subject: subject
                }
                return done(null, response)
            }
        } catch (err) {
            done(err)
        }
    }
)

// jwt
const jwtStrategy = new JWTstrategy(
    {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET_KEY
    },
    (jwt_payload, done) => {
        try {
            MUsers.findOne({
                where: { username: jwt_payload.username }
            })
                .then(user => {
                    if (user) {
                        done(null, user)
                    } else {
                        done(true, null, { message: 'Invalid token number!' })
                    }
                })
        } catch(err) {
            done(err)
        }
    }
)

module.exports = { 
    loginStrategy, 
    registerAdminStrategy, 
    registerLecturerStrategy, 
    jwtStrategy 
}