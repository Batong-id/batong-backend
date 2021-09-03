require('dotenv').config({ path: "./config.env" })
const path = require("path");
const cors = require("cors");
const express = require('express')
const connectDB = require('./config/db')
const errorHandler = require('./middleware/error')

//Connect to Database
connectDB();
const app = express()

app.use(express.json())
app.use(cors())

app.use('/api/v1/auth', require('./routes/auth'))
app.use('/api/v1/user', require('./routes/user'))
app.use('/api/v1/private', require('./routes/private'))
app.use('/api/v1/product', require('./routes/product'))
app.use('/api/v1/category', require('./routes/category'))

//Error Handler (should be last piece of middleware)
app.use(errorHandler)


const PORT = process.env.PORT || 5000

const server = app.listen(PORT, () => console.log(`listenting to port ${PORT}`))

process.on("unhandledRejection", (err, promise) => {
    console.log(`error = ${err}`)
    server.close(() => process.exit(1))
})
