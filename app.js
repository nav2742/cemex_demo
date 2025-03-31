const express = require('express')
const otp_gen = require('./routers/otp_generators')
const payslips = require('./Payslips/payslips')
const app = express()

app.use(express.json());

app.use('',otp_gen)
app.use('',payslips)

const port = process.env.PORT||3000
app.listen(port,()=>console.log(`Listening on ${port}`))