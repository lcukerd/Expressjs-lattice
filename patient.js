const Joi = require('joi').extend(require('joi-phone-number'));

// Patient class
class Patient {

  constructor(name, add, email, pno, pass) {
    this.name = name;
    this.add = add;
    this.email = email;
    this.pno = pno;
    this.pass = pass;
  }
}

// Schema of valid Patients
const Schema = Joi.object().keys({
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
