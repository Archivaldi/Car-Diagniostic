var express = require("express");
var app = express();
var bodyParser = require("body-parser");
app.set("view engine", "ejs");

//mysql package
const mysql = require("mysql");

const path = require("path");

// //session stuff
var cookieParser = require('cookie-parser');
var bcrypt = require('bcryptjs');

var session = require('express-session');
app.use(cookieParser());

//allow sessions
app.use(session({ secret: 'app', cookie: { maxAge: 1 * 1000 * 60 * 60 * 24 * 365 } }));


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
app.get("/index", function (req, res) {
    res.render("index");
});

app.get("/OBD_LookUp", function (req, res) {
    res.render("obdlookup");
});

app.get("/sign-up", function (req,res){
    res.render("signup");
})

app.get("/log-in", function (req,res){
    res.render("login");
});

app.get("/vindecoder", function (req,res){
    res.render("vindecoder");
})
app.post("/login", function (req, res) {
    var userEmail = req.body.email;
    var password = req.body.password;

    connection.query('SELECT * FROM users LEFT JOIN car_data USING (user_id) WHERE user_email = ?', [userEmail], function (error, results, fields) {
        if (error) throw error;
        if (results == 0) {
            res.send("Invalid Email and/or password. Please try again");
        } else {
            bcrypt.compare(password, results[0].user_p_hash, function (err, result) {

                if (result == true) {

                    req.session.user_id = results[0].user_id;
                    req.session.email = results[0].user_email;
                    req.session.name = results[0].user_name;                    
                    req.session.car_model = results[0].car_model;                    
                    req.session.car_make = results[0].car_make;                    
                    req.session.car_year = results[0].car_year;                                      
                    res.send('you are logged in');
                    //res.redirect(profile page will go here);  


                } else {
                    res.redirect('/');
                }
            });
        }
    });
});

app.get('/another-page', function(req, res){
	var user_info = {
		user_id : req.session.user_id,
        email: req.session.email,  
        name: req.session.name,                   
        car_model: req.session.car_model,                  
        car_make: req.session.car_make,                   
        car_year: req.session.car_year   
    }
    res.json(user_info);
});

app.get('/logout', function(req, res){
	req.session.destroy(function(err){
		res.send('you are logged out');
	})
});

app.get("/", function (req, res) {
    connection.query("SELECT * FROM role_types", function (err, result) {
        res.render("index", { res: result });
    })
})



app.post("/signup", function (req, res) {
    var userEmail = req.body.email;
    var userName = req.body.name;
    var password = req.body.password;
    var carMake = req.body.carmake;
    var carModel = req.body.carModel;
    var carYear = req.body.year;

    function selectNewUserId(email) {
        connection.query("SELECT * FROM users WHERE user_email=?", [email], function (err, result) {
            insertCar(result[0].user_id, carMake, carModel, carYear);
        })
    }


    function insertCar(userId, make, model, year) {
        connection.query("INSERT INTO car_data (user_id, car_model, car_make, car_year) VALUES (?, ?, ?, ?)", [userId, make, model, year], function (err, result) {
            res.send("You signed up!")
            //res.redirect(profile page will go here);  
        })
    }

    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(password, salt, function (err, p_hash) {
            connection.query("INSERT INTO users(user_email, user_name, user_p_hash) VALUES (?, ?, ?)", [userEmail, userName, p_hash], function (err, result) {
                if (err) {
                    res.send("You need to use a unique email")
                } else {
                    selectNewUserId(userEmail);
                };
            });
        });
    });
});

app.listen(3000, function () {
    console.log("Listening on 3000");
});