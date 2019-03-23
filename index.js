const Patient = require('./patient.js').patient;
const Schema = require('./patient.js').schema;
const db = require('./database.js');

const express = require('express');
const app = express()
const Joi = require('joi');

app.use(express.json());

// API to add patient
app.post('/add', (req, res) => {
  const result = Joi.validate(req.body, Schema);
  console.log(result);

  if (result.error) return res.status(400).send(result.error.details[0].message);

  db.add(new Patient(null, req.body.name, req.body.add, req.body.email, req.body.pno, req.body.pass), res)
});

// API to update patient details
app.put('/update', (req, res) => {
  const result = Joi.validate(req.body, Schema);
  console.log(result);

  if (result.error) return res.status(400).send(result.error.details[0].message);

  db.update(new Patient(req.body.id, req.body.name, req.body.add, req.body.email, req.body.pno, req.body.pass), res)
});

// API to delete patient from db
app.delete('/delete', (req, res) => {
  const Schema_delete = Schema.keys({
    id: Joi.number().integer().required()
  });
  const result = Joi.validate(req.body, Schema_delete);
  console.log(result);

  if (result.error) return res.status(400).send(result.error.details[0].message);

  db.remove(new Patient(req.body.id, req.body.name, req.body.add, req.body.email, req.body.pno, req.body.pass), res)

  res.status(200);
});

// API to fetch all patient in ascending order of time added
app.get('/', (req, res) => {
  db.fetch_all(res)
});

port = process.env.port || 4222

app.listen(port, () => {
  console.log("Listening on port " + port)
})
