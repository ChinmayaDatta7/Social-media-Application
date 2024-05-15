const mongoose = require("mongoose");
const env = require("./environment");

//connecting to the database
mongoose.connect(`mongodb://localhost/${env.db}`);

//acquiring the connection to check if it is successful or not and storing it in db
const db = mongoose.connection;

//console.error.bind is used to bind the error to console so that it is printed
//displays console.log like an error
db.on("error", console.error.bind(console, "error connecting to db"));

//up and running then print the message
db.once("open", function () {
  console.log("Successfully connected to the database");
});

module.exports = db;
