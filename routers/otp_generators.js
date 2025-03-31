const express = require('express')
const routes = express.Router()
const crypto = require('crypto');
const axios = require('axios')




async function trigering_OTP(text){

    let req ={
        url: "https://api.twilio.com/2010-04-01/Accounts/AC3066e70bbdb16fb2c4f81b7358a7d2e6/Messages.json",
        method: "POST",
        headers:{
            "Content-Type": 'application/x-www-form-urlencoded',
    
        },
        auth:{
            username:"AC3066e70bbdb16fb2c4f81b7358a7d2e6",
            password:"bd6c912592a2145ede149d4d265a0801"
        },
        data:new URLSearchParams({
            'To': '+14165540315', 
            'From': '+17542511635', 
            'Body': text
        })
    }
    try {
        const response = await axios(req);
        console.log("OTP Generated successfully")
        return `OTP sent successfully: ${response.data.sid}`;
    } catch (err) {
        console.error('Error sending OTP:', err);
        throw new Error('Failed to send OTP');
    }

}


routes.post('/generate-otp',async (req,res)=>{
    try{
        const otp =  crypto.randomInt(100000, 999999).toString()
        const otptrigger = await trigering_OTP(otp)
        res.status(201).send(otptrigger)
    }catch(err){
        res.status(500).send({ message: 'Error generating OTP', error: error.message });
    }
    
})

module.exports = routes