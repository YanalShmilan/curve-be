const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config();
const cors = require('cors');

const transporter = nodemailer.createTransport({
  port: 587, // true for 465, false for other ports
  host: 'smtp.gmail.com',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.APP_PASSWORD,
  },
  secure: false,
});

const app = express();
app.disable('etag');
app.use(cors());

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));

const route = express.Router();

const port = process.env.PORT || 8000;

app.use('/v1', route);

route.post('/send', (req, res) => {
  const { text, email, message, subject, html } = req.body;
  const mailData = {
    from: process.env.EMAIL, // sender address
    to: email, // list of receivers
    subject: subject,
    text: text,
    html: html,
  };

  transporter.sendMail(mailData, function (err, info) {
    if (err) {
      res.status(500).send({
        email: req.email,
      });
    } else {
      console.log(req.body);
      res.status(200).send({
        email: req.email,
      });
    }
  });
});

route.get('/check', (req, res) => {
  res.status(200).send({
    message: 'Server is up and running',
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
