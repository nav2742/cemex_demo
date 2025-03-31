const express = require('express')
const routes = express.Router()
let months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

routes.post('/payslips', (req, res) => {
    let a = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
    
    let months_from = req?.body?.Months || 0; 
    let date = new Date()
    let current_month = date.getMonth(); 
    let current_year = date.getFullYear();

    let payslips = [];
    for (let i = 0; i < months_from; i++) {
        let month_index = current_month - i;
        let year = current_year;

        if (month_index < 0) {
            month_index = 12 + month_index; 
            year = current_year - 1;
        }

        let payslip = {
            month: months[month_index],
            year: year,
            url: a, 
        };
        
        payslips.push(payslip);
    }
    res.status(200).send(payslips);
});






module.exports = routes