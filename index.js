const Patient = require("./patient.js").patient;
const Schema = require("./patient.js").schema;
const db = require("./database.js");
const swaggerDoc = require("./swagger");

const express = require("express");
const app = express();
const Joi = require("joi");

app.use(express.json());

/**
 * @swagger
 * /add:
 *    post:
 *      description: This is used to add new patients
 */
app.post("/add", (req, res) => {
  const result = Joi.validate(req.body, Schema);
  console.log(result);

  if (result.error)
    return res.status(400).send(result.error.details[0].message);

  db.add(
    new Patient(
      null,
      req.body.name,
      req.body.add,
      req.body.email,
      req.body.pno,
      req.body.pass
    ),
    res
  );
});

/**
 * @swagger
 * /update:
 *    put:
 *      description: This is used to update existing patients
 */
app.put("/update", (req, res) => {
  const result = Joi.validate(req.body, Schema);
  console.log(result);

  if (result.error)
    return res.status(400).send(result.error.details[0].message);

  db.update(
    new Patient(
      req.body.id,
      req.body.name,
      req.body.add,
      req.body.email,
      req.body.pno,
      req.body.pass
    ),
    res
  );
});

/**
 * @swagger
 * /delete:
 *    delete:
 *      description: This is used to delete patients given his id
 */
app.delete("/delete", (req, res) => {
  const Schema_delete = Schema.keys({
    id: Joi.number()
      .integer()
      .required()
  });
  const result = Joi.validate(req.body, Schema_delete);
  console.log(result);

  if (result.error)
    return res.status(400).send(result.error.details[0].message);

  db.remove(
    new Patient(
      req.body.id,
      req.body.name,
      req.body.add,
      req.body.email,
      req.body.pno,
      req.body.pass
    ),
    res
  );

  res.status(200);
});

/**
 * @swagger
 * /:
 *    get:
 *      description: This should return all patients
 */
app.get("/", (req, res) => {
  db.fetch_all(res);
});

port = process.env.port || 4222;

app.listen(port, () => {
  console.log("Listening on port " + port);
});

swaggerDoc(app);
