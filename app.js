require('dotenv').config()
require('./utils/passport-auth')
const cors = require('cors')
const express = require('express')
const app = express()

const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const db = require('./config/database')
const timezone = require('dayjs/plugin/timezone')
const router = require('./routes/routes')
const passport = require('passport')

const { 
    jwtStrategy,
    loginStrategy,
    registerAdminStrategy, 
    registerLecturerStrategy
} = require('./utils/passport-auth')

startServer({ port: process.env.PORT })
    .then(connectDB())
    .catch(err => {
        console.error(err)
    })

async function connectDB() {
    try {
        await db.authenticate()
        console.log('connected to database!')
    } catch (error) {
        console.error('Unable to connect to the database: ', error)
    }
}

// ensures we close the server in the event of an error.
function setupCloseOnExit(server) {
    // thank you stack overflow
    async function exitHandler(options = {}) {
        await server
            .close()
            .then(() => {
                console.log('Server successfully closed')
            })
            .catch((e) => {
                console.error('Server successfully closed: ', e)
            })

        if (options.exit) {
            if (options.exit) {
                // eslint-disable-next-line no-process-exit
                process.exit()
                // throw new Error('Exit process.exit Node JS')
            }
        }
    }

    // do something when app is closing
    process.on('exit', exitHandler)
    // catches ctrl+c event
    process.on('SIGINT', exitHandler.bind(null, { exit: true }))
    // catches "kill pid" (for example: nodemon restart)
    process.on('SIGUSR1', exitHandler.bind(null, { exit: true }))
    process.on('SIGUSR2', exitHandler.bind(null, { exit: true }))
    // catches uncaught exceptions
    process.on('uncaughtException', exitHandler.bind(null, { exit: true }))
}

function startServer({ port = process.env.PORT } = {}) {
    app.use(express.urlencoded({
        limit: '2mb',
        extended: true
    }))
    
    // set time zone
    dayjs.extend(utc)
    dayjs.extend(timezone)
    dayjs.tz.setDefault('Asia/Jakarta')

    // set utility
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use(cors({ origin: true, exposedHeaders: ['Content-Disposition']}))

    // set routes
    app.use('/api', router)

    // set passport
    passport.use('jwt', jwtStrategy)
    passport.use('login', loginStrategy)
    passport.use('register-admin', registerAdminStrategy)
    passport.use('register-lecture', registerLecturerStrategy)

    // service check
    app.get('/', (req, res) => {
        return res.status(200).json({
            success: true,
            code: 200,
            message: 'service is running and connected, current time : ' + dayjs().format('YYYY-MM-DD HH:mm:ss')
        })
    })

    return new Promise((resolve) => {
        const server = app.listen(port, () => {
            console.log(`Server is running on ports: ${port}`)

            // this block of code turns `server.close` into a promise API
            const originalClose = server.close.bind(server)
            server.close = () => new Promise((resolveClose) => {
                originalClose(resolveClose);
            })

            // this ensures that we properly close the server when the program exists
            setupCloseOnExit(server)

            // resolve the whole promise with the express server
            resolve(server)
        })
    })
}