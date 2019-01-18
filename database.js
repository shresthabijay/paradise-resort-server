var mysql = require('mysql');
const config=require("./server.config")

var db= mysql.createConnection(config.database);

db.connect(function(err) {
  if (err) {};
  console.log("Database Connected!");
});

module.exports=db