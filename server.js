const express = require('express');
const cors = require('cors');
require('dotenv').config()

const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const nodemailer = require("nodemailer");
const schedule = require('node-schedule');


app.use(cors())

app.use(bodyParser.json())

const job = schedule.scheduleJob('11 * * * *', function(){
  var mailOptions = {
    from : "info@payrolldates.com",
    to: "max.blade.hansen@gmail.com",
    subject : `hey there`,
    text : `this is a scheduled email!`}
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
        res.status(401).json('error it did not worky');
      } else {
        console.log("email sent")
        res.json('Email sent!');
      }
    });
 
});

  const transporter = nodemailer.createTransport({
    host: "mail.privateemail.com",
    port: 465,
    secure: true,
    auth: {
      user: 'info@payrolldates.com',
      pass: process.env.pass_key
    }
  });

app.get('/', (req, res) => {
    res.send({"text" : 'Hello client!'});
  });

app.post('/email', (req, res) => {  
  var mailOptions = {
    from : "info@payrolldates.com",
    to: "max.blade.hansen@gmail.com",
    subject : `hey there`,
    text : `${req.body}`}
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
        res.status(401).json('error it did not worky');
      } else {
        console.log("email sent")
        res.json('Email sent!');
      }
    });
  });


  

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });



  
  
  