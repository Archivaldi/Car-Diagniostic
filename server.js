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

app.use(function (req, res, next) {
    res.locals.user = req.session.name || '';
    next();
});

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

app.get("/sign-up", function (req, res) {
    res.render("signup");
})

app.get("/log-in", function (req, res) {
    res.render("login");
});

app.get("/vindecoder", function (req, res) {
    res.render("vindecoder", { car_vin: res.locals.car_vin });
});

app.get("/profile", function (req, res) {
    res.render("profile", {
        email: req.session.email,
        name: req.session.name,
        cars: req.session.user_cars
    });
});

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
                    req.session.logged_in = true;
                    req.session.user_id = results[0].user_id;
                    req.session.email = results[0].user_email;
                    req.session.name = results[0].user_name;
                    res.locals.user = req.session.name;

                    var userCars = req.session.user_cars = [];

                    for (var i = 0; i < results.length; i++) {
                        var car = {};
                        car.car_make = results[i].car_make;
                        car.car_model = results[i].car_model;
                        car.car_year = results[i].car_year;
                        car.car_vin = results[i].car_vin;
                        userCars.push(car);
                    }

                    res.redirect("/profile");

                } else {
                    res.redirect('/');
                };
            });
        };
    });
});
app.get('/another-page', function (req, res) {
    var user_info = {
        user_id: req.session.user_id,
        email: req.session.email,
        name: req.session.name,
        cars: req.session.user_cars
    }
    res.json(user_info);
});

app.get('/logout', function (req, res) {
    req.session.destroy(function (err) {
        res.redirect('/');
    })
});

app.get("/", function (req, res) {
    connection.query("SELECT * FROM role_types", function (err, result) {
        res.render("index", { res: result });
    })
})

app.post("/addNewCar", function(req,res){
    var carMake = req.body.carMake;
    var carModel = req.body.carModel;
    var carYear = req.body.year;
    var carVin = req.body.carVin;

    connection.query("INSERT INTO car_data (user_id, car_make, car_model, car_year, car_vin) VALUES (?, ?, ?, ?, ?)", [req.session.user_id, carMake, carModel, carYear, carVin], function (err, result){
        takeNewCars(req.session.user_id);
    });

    function takeNewCars (userId) {
        connection.query("SELECT * FROM users LEFT JOIN car_data USING (user_id) WHERE user_id = ?", [userId], function (err, results){

                    req.session.user_cars = [];

                    for (var i = 0; i < results.length; i++) {
                        var car = {};
                        car.car_make = results[i].car_make;
                        car.car_model = results[i].car_model;
                        car.car_year = results[i].car_year;
                        car.car_vin = results[i].car_vin;
                        req.session.user_cars.push(car);
                    }

                    res.redirect("/profile");
        })
    }
})



app.post("/signup", function (req, res) {
    var userEmail = req.body.email;
    var userName = req.body.name;
    var password = req.body.password;
    var carMake = req.body.carMake;
    var carModel = req.body.carModel;
    var carYear = req.body.year;
    var carVin = req.body.carVin;


    function selectNewUserId(email) {
        connection.query("SELECT * FROM users WHERE user_email=?", [email], function (err, result) {
            insertCar(result[0].user_id, carMake, carModel, carYear, carVin);
        })
    }


    function insertCar(userId, make, model, year, vin) {
        connection.query("INSERT INTO car_data (user_id, car_make, car_model, car_year, car_vin) VALUES (?, ?, ?, ?, ?)", [userId, make, model, year, vin], function (err, result) {
            req.session.logged_in = true;
            req.session.user_id = userId;

            connection.query("SELECT * FROM users LEFT JOIN car_data USING (user_id) WHERE user_id = ?", [userId], function (err, results) {

                req.session.email = results[0].user_email;
                req.session.name = results[0].user_name;
                res.locals.user = req.session.name;

                var userCars = req.session.user_cars = [{
                    car_make: results[0].car_make,
                    car_model: results[0].car_model,
                    car_year: results[0].car_year,
                    car_vin: results[0].car_vin
                }];

                 res.redirect("/profile");
            })
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