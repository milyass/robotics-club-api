const mongoose = require('mongoose')
const chalk = require('chalk')

const DB_SERVICE_URL = process.env.DB_SERVICE_URL

const dbconnect = async () => {
    try {
        const conn = await mongoose.connect(DB_SERVICE_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log(chalk`{greenBright MongoDb} connected: ${conn.connection.host}`)
    } catch (err) {
        console.error(err)
        process.exit(1)
    }
}

module.exports = dbconnect   