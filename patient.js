const Joi = require('joi').extend(require('joi-phone-number'));

// Patient class
class Patient {

  constructor(id, name, add, email, pno, pass) {
    this._id = id;
    this._name = name;
    this._add = add;
    this._email = email;
    this._pno = pno;
    this._pass = pass;
  }

  set id(id) {
    this._id = id;
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  get add() {
    return this._add;
  }

  get email() {
    return this._email;
  }

  get pno() {
    return this._pno;
  }

  get pass() {
    return this._pass;
  }
}

// Schema of valid Patients
const Schema = Joi.object().keys({
  id: Joi.number().integer(),
  name: Joi.string().min(3).required(),
  add: Joi.string().min(10).required(),
  email: Joi.string().email({
    minDomainAtoms: 2
  }).required(),
  pno: Joi.string().phoneNumber().min(10).required(),
  pass: Joi.string().min(8).max(15).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/).required().error(errors => {
    errors.forEach(err => {
      switch (err.type) {
        case "string.min":
          err.message = `pass should have at least ${err.context.limit} characters!`;
          break;
        case "string.max":
          err.message = `pass should have at most ${err.context.limit} characters!`;
          break;
        case "string.regex.base":
          err.message = `pass must contain one upper character, one lower character and a number!`;
          break;
        default:
          err.message = err.type;
          break;
      }
    });
    return errors;
  })
});

module.exports = {
  patient: Patient,
  schema: Schema
}
