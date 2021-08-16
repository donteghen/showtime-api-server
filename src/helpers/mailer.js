const nodemailer = require("nodemailer");
const {mailerEmail, mailerPassword}  = require('../config/env')
const sendMail = (req, res) => {
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
            user: process.env.EMAIL || mailerEmail, // generated ethereal user
            pass: process.env.EMAIL || mailerPassword, // generated ethereal password
            },
        });

        transporter.verify(function(error, success) {
            if (error) {
            console.log(error);
            return
            } else {
            console.log("Server is ready to take our messages");
            }
        });
        //console.log(req.body)
        let mail = {
            from: req.body.email, // sender address
            to: process.env.EMAIL || 'donteghen@yahoo.com', // list of receivers
            subject: req.body.subject, // Subject line
            text: req.body.message, // plain text body
            html: `<div><h1>From: ${req.body.email}</h1><h3>${req.body.name} say's :</h3><h5>${req.body.message}</h5></div>`, // html body
        }
        transporter.sendMail(mail, (error, info) => {
            if (error){
                res.status(400).send('failed!') 
            }
            else{
                res.send({sent : true});
            }
            
        });

}
module.exports = sendMail