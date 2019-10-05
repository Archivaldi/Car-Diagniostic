var express = require("express");
var app = express();
var bodyParser = require("body-parser");
app.set("view engine", "ejs");

//mysql package
const mysql = require("mysql");

//add dotenv package for hiding private data
require("dotenv").config();
const keys = require("./keys.js");
var connection = mysql.createConnection(keys.data);

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public'));

// Creates the connection with the server and loads the product data upon a successful connection
connection.connect(function (err) {
    if (err) {
        console.log(err);
    }
    console.log("Database connected");
});


app.get("/", function (req, res) {
    connection.query("SELECT * FROM role_types", function (err, result) {
        res.render("index", { res: result });
    })
})
app.get("/signup", function (req, res) {
    connecttion.query
})

app.listen(3000, function () {
    console.log("Listening on 3000");
});