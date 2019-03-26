const Patient = require("./patient.js").patient;

var sqlite = require("sqlite3").verbose();

// Load Database
var db = new sqlite.Database("Psychiatrists");

// Create table if not exists
db.run(
  "CREATE TABLE IF NOT EXISTS patients (Id INT PRIMARY KEY, Name TEXT, Address TEXT, Email TEXT, pno INT, Pass TEXT)"
);

// Insert new patients to database and return its ID
module.exports.add = function add(patient, res) {
  let time = getms();
  db.run(
    "INSERT INTO patients VALUES($id,$name,$add,$email,$pno,$pass) ",
    {
      $name: patient.name,
      $add: patient.add,
      $email: patient.email,
      $pno: patient.pno,
      $pass: patient.pass,
      $id: time
    },
    (err, row) => {
      if (err != null) {
        console.log(err.message);
        res.status(500);
      } else {
        console.log("Patient added successfully");
        patient.id = time;
        res.status(200).send(patient);
      }
    }
  );
};

// Update existing patients in database using its ID
module.exports.update = function update(patient, res) {
  db.run(
    "UPDATE patients SET NAME = $name, Address = $add, Email = $email, pno = $pno, Pass = $pass WHERE Id = $id",
    {
      $name: patient.name,
      $add: patient.add,
      $email: patient.email,
      $pno: patient.pno,
      $pass: patient.pass,
      $id: patient.id
    },
    (err, row) => {
      if (err != null) {
        console.log(err.message);
        res.status(500);
      } else {
        console.log("Patient Updated successfully");
        res.status(200).send(patient);
      }
    }
  );
};

// Return list of all patients available in Database
module.exports.fetch_all = function fetch_all(res) {
  db.all("SELECT * FROM patients ORDER BY Id ASC", {}, (err, row) => {
    if (row === undefined) {
      console.log("Nothing found");
      res.send("");
    } else {
      let patients = [];
      for (let i = 0; i < row.length; i++) {
        patients.push(
          new Patient(
            row[i].Id,
            row[i].Name,
            row[i].Address,
            row[i].Email,
            row[i].pno,
            row[i].Pass
          )
        );
      }
      res.send(patients);
    }
  });
};

// Remove patient from database given the ID
module.exports.remove = function remove(patient, res) {
  db.run(
    "DELETE FROM patients WHERE Id = $id",
    {
      $id: patient.id
    },
    (err, row) => {
      if (err != null) {
        console.log(err.message);
        res.status(500);
      } else {
        console.log("Patient deleted successfully");
        res.status(200).send();
      }
    }
  );
};

// Using time of call in milliseconds as ID
function getms() {
  return new Date().getTime();
}
