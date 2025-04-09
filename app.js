const express = require('express')
const otp_gen = require('./routers/otp_generators')
const payslips = require('./Payslips/payslips')

const boardingPass = require('./routers/boardingPass');

const app = express()

app.use(express.json());

app.use('',otp_gen)
app.use('',payslips)
app.use('/boarding-pass', boardingPass)

const port = process.env.PORT||3000
app.listen(port,()=>console.log(`Listening on ${port}`))