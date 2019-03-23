const Patient = require('./patient.js').patient;
const Schema = require('./patient.js').schema;

const express = require('express');
const app = express()
const Joi = require('joi');

app.use(express.json());

let p = new Patient("A", "B", "C", 98, "pass");


// API to add patient
app.post('/add', (req, res) => {
  const result = Joi.validate(req.body, Schema);
  console.log(result);

  if (!result.error) return res.send("Perfect")

  res.send(result.error.details[0].message);
});

// API to update patient details
app.put('/update', (req, res) => {

});

// API to delete patient from db
app.delete('/delete', (req, res) => {

});

// API to fetch all patient in ascending order of time added
app.get('/', (req, res) => {
  res.send(p);
});

port = process.env.port || 4242

app.listen(port, () => {
  console.log("Listening on port " + port)
})
