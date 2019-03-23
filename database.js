const Patient = require('./patient.js').patient;
const CryptoJS = require("crypto-js");

var sqlite = require('sqlite3').verbose();
var db = new sqlite.Database('Psychiatrists');

db.run("CREATE TABLE IF NOT EXISTS patients (Id INT PRIMARY KEY, Name TEXT, Address TEXT, Email TEXT, pno INT, Pass TEXT)");

module.exports.add = function add(patient, res) {
  let time = getms();
  db.run("INSERT INTO patients VALUES($id,$name,$add,$email,$pno,$pass) ", {
    $name: patient.name,
    $add: patient.add,
    $email: patient.email,
    $pno: patient.pno,
    $pass: encryptor(patient.pass, patient.pno),
    $id: time
  }, (err, row) => {
    if (err != null) {
      console.log(err.message);
      res.status(500);
    } else {
      console.log("Patient added successfully");
      patient.id = time;
      res.status(200).send(patient);
    }
  });
}

module.exports.update = function update(patient, res) {
  db.run("UPDATE patients SET NAME = $name, Address = $add, Email = $email, pno = $pno, Pass = $pass WHERE Id = $id", {
    $name: patient.name,
    $add: patient.add,
    $email: patient.email,
    $pno: patient.pno,
    $pass: encryptor(patient.pass, patient.pno),
    $id: patient.id
  }, (err, row) => {
    if (err != null) {
      console.log(err.message);
      res.status(500);
    } else {
      console.log("Patient Updated successfully");
      res.status(200).send(patient);
    }
  });
}

module.exports.fetch_all = function fetch_all(res) {
  db.all("SELECT * FROM patients ORDER BY Id ASC", {}, (err, row) => {
    if (row === undefined) {
      console.log("Nothing found");
      res.send("")
    } else {
      let patients = []
      for (let i = 0; i < row.length; i++) {
        patients.push(new Patient(row[i].Id, row[i].Name, row[i].Address, row[i].Email, row[i].pno, decryptor(row[i].Pass, row[i].pno)));
      }
      res.send(patients);
    }
  });
}

module.exports.remove = function remove(patient, res) {
  db.run("DELETE FROM patients WHERE Id = $id", {
    $id: patient.id
  }, (err, row) => {
    if (err != null) {
      console.log(err.message);
      res.status(500);
    } else {
      console.log("Patient deleted successfully");
      res.status(200).send();
    }
  });
}

function encryptor(pass, key) {
  // return CryptoJS.AES.encrypt(pass, key);
  return pass;
}

function decryptor(pass, key) {
  // return CryptoJS.AES.decrypt(pass, key);
  return pass;
}

function getms() {
  return new Date().getTime();
}

process.on('SIGHUP', function() {
  console.log('Exitting...');
  db.close();
  process.exit();
});
