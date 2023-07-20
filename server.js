const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
app.use(cors())

const { MongoClient, ServerApiVersion } = require("mongodb");
var uri = "mongodb://localhost:27017";
const bodyParser = require('body-parser');

const port = 3000;
const nodemailer = require("nodemailer");
const schedule = require('node-schedule');


app.use(bodyParser.json())

app.use('/', (req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log(req.body)
  next();
});


const client = new MongoClient(uri,  {
  serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
  }});

const transporter = nodemailer.createTransport({
    host: "mail.privateemail.com",
    port: 465,
    secure: true,
    auth: {
      user: 'info@payrolldates.com',
      pass: process.env.pass_key
    }
  });
  
function convertMMDDYY(input){
              let newDate = new Date(input);
              let temp = (newDate.getMonth()+1).toString().padStart(2, '0') + '/' +
              newDate.getDate().toString().padStart(2, '0') + '/' +
              (newDate.getFullYear() % 100).toString().padStart(2, '0'); 
              console.log(temp,"mmddyy") 
              return temp 
  }

function genSendDate(lastDate){ 
          lastDate = new Date(lastDate);
          let temp = lastDate.getDate()
          console.log(lastDate,"last date")
          day1 = new Date(lastDate.setDate(temp+14));
          return convertMMDDYY(day1);
      }

function genDatesArr(lastDate){
  lastDate = new Date(lastDate);
  let temp = lastDate.getDate()
  console.log(lastDate,"last date")
  day1 = new Date(lastDate.setDate(temp+1));
  day2 = new Date(lastDate.setDate(temp+14));
  let datesArr = [convertMMDDYY(day1),convertMMDDYY(day2)]
  return datesArr
}

schedule.scheduleJob('0 0 4 * * *', function(){
  findUsers()
});

async function findUsers() {
  try {
    await client.connect();
    const database = client.db('pddb');
    const collection = database.collection('users');
    let today = new Date();
    let todayString = (today.getMonth()+1).toString().padStart(2, '0') + '/' +
                      today.getDate().toString().padStart(2, '0') + '/' +
                      (today.getFullYear() % 100).toString().padStart(2, '0');  
    const cursor = collection.find({sendDate: todayString});
    const payTodayUsers = await cursor.toArray();
    emailUsers(payTodayUsers);
  } finally {
    await client.close();}
  }

function emailUsers(payTodayUsers){
    for (let i = 0; i < payTodayUsers.length; i++) {
      var mailOptions = {
        from : "info@payrolldates.com",
        to: payTodayUsers[i].email,
        subject : `Paydates!`,
        text : `Start date is ${payTodayUsers[i].startDate} end date is ${payTodayUsers[i].endDate}`}
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
            res.status(401).json('error it did not worky');
          } else {
            console.log("email sent")
            res.json('Email sent!');
          }
        });

        async function updateDates(lastDate,id,sendDate) {
          try {
            await client.connect();
            const database = client.db('pddb');
            const collection = database.collection('users');
            let newDatesArr = genDatesArr(lastDate);

            let result = await collection.updateOne(
              { _id: id},  
              { $set: { "startDate": newDatesArr[0], "endDate": newDatesArr[1], "sendDate": genSendDate(sendDate)} }  
            );

            console.log(result)
            //const payTodayUser = await cursor.toArray();
            //console.log('found'+JSON.stringify(payTodayUser));
        
            } finally {
            //await client.close();
            }
          }
      updateDates(payTodayUsers[i].endDate,payTodayUsers[i]._id,payTodayUsers[i].sendDate)
    }
  }

app.post('/api/addUser', (req, res) => {  
  var data = req.body;
  async function addUser(data) {
      try {
        await client.connect();
        const database = client.db('pddb');
        const collection = database.collection('users');
        const doc = { email: data.email , startDate: data.startDate, endDate: data.endDate, sendDate: data.sendDate };
        const result = await collection.insertOne(doc);
        console.log(`A document was inserted with the _id: ${result.insertedId}`);

        var mailOptions = {
          from : "info@payrolldates.com",
          to: data.email,
          subject : `Thank you for joining Payrolldates.com!`,
          text : `We will send you an email every morning you send payroll in with the dates of your payroll. Thank you!`}
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
              res.status(401).json('error it did not worky');
            } else {
              console.log("email sent")
              res.json('Email sent!');
            }
          });

      } finally {
        await client.close();
      }
    }
  addUser(data).catch(console.dir);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });



  
  
  