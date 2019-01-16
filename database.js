var mysql = require('mysql');

var db= mysql.createConnection({
  host: "vj.shresthabibek.xyz",
  user: "vj",
  password: "P@ssword@123!!3ljasdflkLJ@#",
  database:"paradise"
});

db.connect(function(err) {
  if (err) {};
  console.log("Database Connected!");
});

module.exports=db